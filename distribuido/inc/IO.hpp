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

struct component
{
    std::string type;
    std::string tag;
    int gpio;
    int state = 0;
};

class IO
{
public:
    IO();
    IO(std::vector<component> inputs, std::vector<component> outputs);
    ~IO();
    std::vector<component> getInputs();
    std::vector<component> getOutputs();
    void initComponents();

protected:
    EventController *event_;

private:
    std::vector<component> inputComponents_;
    std::vector<component> outputComponents_;

    auto initComponentWorker(component component);

    // Receives a GPIO port number and translates to a WiringPI pin number
    int toWiringPiPin(int gpio);
};
