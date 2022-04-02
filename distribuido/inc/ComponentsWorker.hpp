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
#include "EventController.hpp"
#include "Component.hpp"
#include "IO.hpp"

class ComponentsWorker
{
public:
    ComponentsWorker(IO *io, EventController *eventController);
    ~ComponentsWorker();
    void start();
    void initComponentWorker(component component);

private:
    IO *io_;

    static EventController *event_;

    static int totalPeople_;
    static int peopleGroundFloor_;
    static int peopleFirstFloor_;

    static int presenceSensor_;
    static int smokeSensor_;
    static int window01_;
    static int window02_;
    static int door_;

    // static handlers because wiringPiISR() won't accept a std::function
    static void PresenceSensorHandler();
    static void SmokeSensorHandler();
    static void Window01Handler();
    static void Window02Handler();
    static void DoorSensorHandler();

    static void CountEnterHandler();
    static void CountExitHandler();
};
