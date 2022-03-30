#pragma once

#include <vector>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <cstring>
#include <iostream>

#include "cJSON.h"

struct component
{
    std::string type;
    std::string tag;
    int gpio;
};

class IO
{
public:
    IO();
    IO(std::vector<component> inputs, std::vector<component> outputs);
    ~IO();
    std::vector<component> getInputs();
    std::vector<component> getOutputs();

private:
    std::vector<component> inputComponents_;
    std::vector<component> outputComponents_;
};
