#pragma once

#include <vector>
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
// #include "IO.hpp"
#include "Component.hpp"

struct address
{
    std::string ip;
    int port;
};

class ServerConfig
{
public:
    ServerConfig(const char *path);
    ~ServerConfig();
    std::string getConfig();
    std::string getName();
    address getAddress();
    std::vector<component> getComponentsJSON(std::string componentType);

private:
    cJSON *config_;
    std::string name_;
    address remoteAddress_;
    void getNameJSON(cJSON *config_json);
    void getAddressJSON(cJSON *config_json);
};
