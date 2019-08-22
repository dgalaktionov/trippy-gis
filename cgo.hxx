#ifndef CTR_CGO_H
#define CTR_CGO_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

void * CTR_load(char *filename, char *linesFile, char *timesFile, char *commons);
void CTR_free(void *ctr);
uint64_t CTR_start(void *ctr, uint32_t s, uint32_t h_start, uint32_t h_end);
uint64_t CTR_end(void *ctr, uint32_t s, uint32_t h_start, uint32_t h_end);
uint64_t CTR_switch(void *ctr, uint32_t s, uint32_t h_start, uint32_t h_end);
uint64_t CTR_board(void *ctr, uint32_t s, uint32_t h_start, uint32_t h_end);
uint64_t CTR_xy(void *ctr, uint32_t s1, uint32_t s2, uint32_t h_start, uint32_t h_end);
uint64_t CTR_xy_area(void *ctr, uint32_t *s1, uint32_t n_s1, uint32_t *s2, uint32_t n_s2, uint32_t h_start, uint32_t h_end);

#ifdef __cplusplus
}
#endif

#endif

