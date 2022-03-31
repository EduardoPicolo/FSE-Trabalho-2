#pragma once

#include <functional>
#include <vector>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <unistd.h>
#include <cstring>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>

#include "cJSON.h"
#include "wiringPi.h"
#include "Socket.hpp"
#include "EventController.hpp"

class SensorWorker
{
public:
    SensorWorker();
    ~SensorWorker();

protected:
private:
};

void WindowSensorHandler();
void PresenceSensorHandler();
void CountEnterHandler();
void CountExitHandler();

static int windowT01 = 0;
static int windowT02 = 0;
static int window101 = 0;
static int window102 = 0;

static int presenceSensorT = 0;
static int presenceSensor1 = 0;
