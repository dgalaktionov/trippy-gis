#include "cgo.hxx"
#include "ctr/src/interface.h"
#include "ctr/src/graphReader.h"
#include <stdio.h>
#include <time.h>
#include <stdlib.h>


QueryType queryTypes[16] = {
    {0, 2, false, get_starts_with_x},
    {1, 2, false, get_ends_with_x},
    {2, 1, false, get_x_in_the_middle},
    {3, 2, false, get_from_x_to_y},
    {4, 1, true, get_top_k},
    {5, 1, false, get_starts_or_ends_with_x},
    {6, 1, true, get_top_k_starts},
    {7, 2, false, get_uses_x},
    {8, 2, false, get_from_x_to_y_strong},
    {9, 2, false, get_from_x_to_y_weak},
    {10, 0, false, get_uses_x},
    {11, 1, true, get_top_k_times},
    {12, 1, true, get_top_k2},
    {13, 1, true, get_top_k_starts_seq},
    {14, 0, false, get_starts_with_x},
    {15, 4, false, get_from_x_to_y}
};

TimeQuery *query;

TimeQuery * prepareQuery() {
    TimeQuery *tq = (TimeQuery *) malloc(sizeof(TimeQuery));
    tq->values = (uint *) malloc(sizeof(uint)*8);
    tq->time = (TimeRange *) malloc(sizeof(TimeRange));

    return tq;
}

void freeQuery(TimeQuery *tq) {
    free(tq->values);
    free(tq->time);
    free(tq);
}

void * CTR_load(char *filename, char *linesFile, char *timesFile, char *commons) {
    void *index;
    ulong Index_size;
    int error= load_index (filename, linesFile, timesFile, &index);
    if (error) {
        return NULL;
    }

    char *basename = commons;
    char *outfilename = (char *)malloc(sizeof(char)*(strlen(basename)+200));
    struct graphDB graph;
    strcpy(outfilename, basename);
    strcat(outfilename, "/lineStops.txt");
    readLines(&graph, fopen(outfilename, "r"));
    strcpy(outfilename, basename);
    strcat(outfilename, "/stopLines.txt");
    readStops(&graph, fopen(outfilename, "r"));
    strcpy(outfilename, basename);
    strcat(outfilename, "/avgTimes.txt");
    readAvgTimes(&graph, fopen(outfilename, "r"));
    strcpy(outfilename, basename);
    strcat(outfilename, "/initialTimes.txt");
    readInitialTimes(&graph, fopen(outfilename, "r"));
    copy_commons(&graph, index);
    free(outfilename);

    index_size(index, &Index_size);

    query = prepareQuery();

    return index;
}

void CTR_free(void * ctr) {
    free_index(ctr);
    freeQuery(query);
}

uint64_t CTR_start(void * ctr, uint32_t s, uint32_t h_start, uint32_t h_end) {
    query->values[1] = s;
    query->time->h_start = h_start;
    query->time->h_end = h_end;
    query->subtype = 0;
    if (h_end) query->subtype |= XY_TIME_START;
    return get_starts_with_x(ctr, query);
}


uint64_t CTR_end(void * ctr, uint32_t s, uint32_t h_start, uint32_t h_end) {
    query->values[1] = s;
    query->time->h_start = h_start;
    query->time->h_end = h_end;
    query->subtype = 0;
    if (h_end) query->subtype |= XY_TIME_END;
    return get_ends_with_x(ctr, query);
}

uint64_t CTR_switch(void * ctr, uint32_t s, uint32_t h_start, uint32_t h_end) {
    query->values[1] = s;
    query->time->h_start = h_start;
    query->time->h_end = h_end;
    query->subtype = 0;
    if (h_end) query->subtype |= XY_TIME_START;
    return get_x_in_the_middle(ctr, query);
}

uint64_t CTR_board(void * ctr, uint32_t s, uint32_t h_start, uint32_t h_end) {
    query->values[1] = s;
    query->time->h_start = h_start;
    query->time->h_end = h_end;
    query->subtype = 0;
    if (h_end) query->subtype |= XY_TIME_START;
    return get_uses_x(ctr, query);
}

uint64_t CTR_xy(void * ctr, uint32_t s1, uint32_t s2, uint32_t h_start, uint32_t h_end) {
    query->values[1] = s1;
    query->values[3] = s2;
    query->time->h_start = h_start;
    query->time->h_end = h_end;
    query->subtype = 0;
    if (h_end) query->subtype |= XY_TIME_START;
    // TODO XY_TIME_END
    return get_from_x_to_y(ctr, query);
}
