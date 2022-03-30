#pragma once

#include <string>
#include <thread>
#include <streambuf>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <semaphore.h>

#include "cJSON.h"

class Singleton
{
public:
    static Singleton *getInstance();

    void connectSocket(char const *ip, int port, int retryCount = 0);
    void closeConnection();
    int getConnection();
    std::string readData();
    void sendData(const char *data);

protected:
    int socket_ = -1;
    const char *ip_;
    int port_;

private:
    static Singleton *inst_; // The one, single instance
    Singleton();
    Singleton(const Singleton &);
    Singleton &operator=(const Singleton &);
};
