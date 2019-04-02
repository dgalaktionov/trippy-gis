package main

// #cgo CXXFLAGS: -Ictr/libcds/includes/
// #cgo LDFLAGS: -Lctr -lwcsa -lsais -lcds -lrt -lzstd
// #include "cgo.hxx"
import "C"
import "unsafe"

var ctr unsafe.Pointer

type CTRError struct {
	err string
}

func (e *CTRError) Error() string {
	return e.err
}

func LoadCTR() unsafe.Pointer {
	ctr = C.loadCTR(C.CString("data/indexes/madrid_lines"),
		C.CString("data/indexes/madrid_lines"),
		C.CString("data/indexes/madrid_lines"),
		C.CString("data/common"))

	if ctr == nil {
		LogAndQuit(&CTRError{"Could not load CTR!"})
	}

	return ctr
}

func CTRStart(s uint32) uint64 {
	return uint64(C.start(ctr, C.uint(s)))
}
