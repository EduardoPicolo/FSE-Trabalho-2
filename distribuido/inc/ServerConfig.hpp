#pragma once

#include <sstream>
#include <iostream>
#include <filesystem>
#include <fstream>
#include <string>
#include <thread>
#include <unistd.h>
#include <cstdio>
#include <cstring>

#include "cJSON.h"

class ServerConfig
{
public:
    ServerConfig(const char *path);
    ~ServerConfig();

private:
    std::string config_;
    std::string getConfig();
};
