#pragma once

#include <string>

struct component
{
    std::string type;
    std::string tag;
    int gpio;
    int state = 0;
};