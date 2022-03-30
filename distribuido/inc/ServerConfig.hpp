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
#include "IO.hpp"

struct address
{
    std::string ip;
    int port;
};

class ServerConfig
{
public:
    ServerConfig(const char *path, IO *io);
    ~ServerConfig();
    std::string getConfig();
    std::string getName();
    address getAddress();

private:
    std::string config_;
    std::string name_;
    void getNameJSON(cJSON *config_json);
    address remoteAddress_;
    void getAddressJSON(cJSON *config_json);
};
