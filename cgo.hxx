#ifndef CTR_CGO_H
#define CTR_CGO_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void * CTR_load(char *filename, char *linesFile, char *timesFile, char *commons);
void CTR_free(void *ctr);
uint64_t CTR_start(void *ctr, uint32_t s);
uint64_t CTR_end(void *ctr, uint32_t s);
uint64_t CTR_switch(void *ctr, uint32_t s);
uint64_t CTR_board(void *ctr, uint32_t s);

#ifdef __cplusplus
}
#endif

#endif

