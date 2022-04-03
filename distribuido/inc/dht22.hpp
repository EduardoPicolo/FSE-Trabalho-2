#ifndef __DHT22__
#define __DHT22__

#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define MAX_TIMINGS 85
#define DEBUG 0
#define WAIT_TIME 2000

typedef struct DHT22_data
{
    float temperature;
    float humidity;
} DHT22_data;

DHT22_data read_dht_data(uint8_t dht_pin);

#endif // __DHT22__