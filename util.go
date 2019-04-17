package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"strconv"
	"strings"
)

func LogAndQuit(err error) bool {
	if err != nil {
		log.Fatalln(err)
		return false
	} else {
		return true
	}
}

func LogAndPanic(err error) bool {
	if err != nil {
		log.Panicln(err)
		return false
	} else {
		return true
	}
}

// A modern language with no function overloading O_o
func LogAndPanic2(err error, c *gin.Context) bool {
	if err != nil && c != nil {
		c.JSON(500, gin.H{
			"message": "shit's on fire yo",
		})
	}

	return LogAndPanic(err)
}

type ArrayFlags []string

func (i *ArrayFlags) String() string {
	return strings.Join((*i)[:], ",")
}

func (i *ArrayFlags) Set(value string) error {
	*i = append(*i, value)
	return nil
}

func Atoi32(s string, c *gin.Context) uint32 {
	i, err := strconv.Atoi(s)
	LogAndPanic2(err, c)
	return uint32(i)
}
