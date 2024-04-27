package main

import (
	"container/list"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// item stored in the cache
type CacheItem struct {
	Key        string      `json:"key"`
	Value      interface{} `json:"value"`
	Expiration time.Time   `json:"expiration"`
}

// Least Recently Used cache
type LRUCache struct {
	capacity     int
	cache        map[string]*list.Element
	evictionList *list.List
	mutex        sync.RWMutex
}

func (lru *LRUCache) PrintCache() {
	lru.mutex.RLock()
	defer lru.mutex.RUnlock()

	log.Println("Cache Contents:")
	for key, elem := range lru.cache {
		item := elem.Value.(*CacheItem)
		log.Printf("Key: %s, Value: %+v, Expiration: %s\n", key, item.Value, item.Expiration)
	}
}

// creates a new LRUCache with the given capacity
func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		capacity:     capacity,
		cache:        make(map[string]*list.Element),
		evictionList: list.New(),
	}
}

// Get retrieves a value from the cache given a key
func (lru *LRUCache) Get(key string) (interface{}, bool) {
	lru.mutex.RLock()
	defer lru.mutex.RUnlock()

	if elem, exists := lru.cache[key]; exists {
		item := elem.Value.(*CacheItem)
		if item.Expiration.Before(time.Now()) {
			lru.removeElement(elem)
			return nil, false
		}
		lru.evictionList.MoveToFront(elem)
		return item.Value, true
	}
	return nil, false
}

// Set adds a new key/value pair to the cache
func (lru *LRUCache) Set(key string, value interface{}, expiration time.Duration) {
	lru.mutex.Lock()
	defer lru.mutex.Unlock()

	if elem, exists := lru.cache[key]; exists {
		item := elem.Value.(*CacheItem)
		item.Value = value
		item.Expiration = time.Now().Add(expiration)
		lru.evictionList.MoveToFront(elem)
	} else {
		item := &CacheItem{
			Key:        key,
			Value:      value,
			Expiration: time.Now().Add(expiration),
		}
		elem := lru.evictionList.PushFront(item)
		lru.cache[key] = elem
		if len(lru.cache) > lru.capacity {
			lru.removeOldest()
		}
	}
}

// removes a key/value pair from the cache
func (lru *LRUCache) Delete(key string) {
	lru.mutex.Lock()
	defer lru.mutex.Unlock()

	if elem, exists := lru.cache[key]; exists {
		lru.removeElement(elem)
	}
}

// removes an element from the eviction list and cache
func (lru *LRUCache) removeElement(elem *list.Element) {
	item := elem.Value.(*CacheItem)
	delete(lru.cache, item.Key)
	lru.evictionList.Remove(elem)
}

// removes the least recently used item from the cache
func (lru *LRUCache) removeOldest() {
	elem := lru.evictionList.Back()
	if elem != nil {
		lru.removeElement(elem)
	}
}

// Initialize cache with capacity of 100
var cache = NewLRUCache(100)

func main() {
	router := gin.Default()

	router.Use(cors.Default())

	router.GET("/get", handleGet)
	router.POST("/set", handleSet)
	router.DELETE("/delete", handleDelete)

	log.Fatal(router.Run(":8080"))
}

func handleGet(c *gin.Context) {
	key := c.Query("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Key parameter is required"})
		return
	}

	value, found := cache.Get(key)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found in cache"})
		return
	}

	c.JSON(http.StatusOK, value)
}

func handleSet(c *gin.Context) {
	var item CacheItem
	if err := c.BindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	cache.Set(item.Key, item.Value, 5*time.Second) // Assuming expiration time of 5 seconds
	cache.PrintCache()

	c.Status(http.StatusCreated)
}

func handleDelete(c *gin.Context) {
	key := c.Query("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Key parameter is required"})
		return
	}

	cache.Delete(key)

	c.Status(http.StatusNoContent)
}
