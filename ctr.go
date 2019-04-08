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

func CTRLoad() unsafe.Pointer {
	ctr = C.CTR_load(C.CString("data/indexes/madrid_lines"),
		C.CString("data/indexes/madrid_lines"),
		C.CString("data/indexes/madrid_lines"),
		C.CString("data/common"))

	if ctr == nil {
		LogAndQuit(&CTRError{"Could not load CTR!"})
	}

	return ctr
}

func CTRFree() {
	C.CTR_free(ctr)
	ctr = nil
}

func CTRStart(s uint32) uint64 {
	return uint64(C.CTR_start(ctr, C.uint(s)))
}

func CTREnd(s uint32) uint64 {
	return uint64(C.CTR_end(ctr, C.uint(s)))
}

func CTRSwitch(s uint32) uint64 {
	return uint64(C.CTR_switch(ctr, C.uint(s)))
}

func CTRBoard(s uint32) uint64 {
	return uint64(C.CTR_board(ctr, C.uint(s)))
}
