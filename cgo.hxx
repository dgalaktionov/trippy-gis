#ifndef CTR_CGO_H
#define CTR_CGO_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void * loadCTR(char *filename, char *linesFile, char *timesFile, char *commons);

uint64_t start(void *ctr, uint32_t s);

#ifdef __cplusplus
}
#endif

#endif

