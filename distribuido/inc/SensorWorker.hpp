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
#include "Component.hpp"

class SensorWorker
{
public:
    SensorWorker();
    ~SensorWorker();
    void initComponents();
    void initComponentWorker(component component);

protected:
    static EventController *event_;

private:
    static int totalPeople_;
    static int peopleGroundFloor_;
    static int peopleFirstFloor_;

    static int presenceSensor_;
    static int smokeSensor_;
    static int window01_;
    static int window02_;

    // static handlers due to wiringPiISR typings
    static void Window01Handler();
    static void Window02Handler();
    static void PresenceSensorHandler();
    static void SmokeSensorHandler();

    static void CountEnterHandler();
    static void CountExitHandler();
};

// void WindowT01Handler();
// void WindowT02Handler();
// void Window101Handler();
// void Window102Handler();

// void PresenceT01Handler();
// void Presence101Handler();

// void CountEnterHandler();
// void CountExitHandler();

// static int windowT01 = 0;
// static int windowT02 = 0;
// static int window101 = 0;
// static int window102 = 0;

// static int presenceSensorT01 = 0;
// static int presenceSensor101 = 0;
