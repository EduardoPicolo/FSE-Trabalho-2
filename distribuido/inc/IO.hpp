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
#include "Component.hpp"

class IO
{
public:
    IO(std::vector<component> inputs, std::vector<component> outputs);
    ~IO();
    std::vector<component> getInputs();
    std::vector<component> getOutputs();
    component getComponent(std::string tag);

    // Receives a GPIO port number and translates to a WiringPI pin number
    int toWiringPiPin(int gpio);

private:
    std::vector<component> inputComponents_;
    std::vector<component> outputComponents_;
};
