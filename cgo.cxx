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

double distance_between(double x1, double y1, double x2, double y2) {
  return 24.0f;
}

uint64_t start(uint32_t s) {
    return 24;
}
