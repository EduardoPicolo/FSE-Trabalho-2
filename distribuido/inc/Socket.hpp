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

class Socket
{
public:
    static Socket *getInstance();

    void connectSocket(char const *ip, int port);
    void closeConnection();
    int getConnection();
    std::string readData();
    void sendData(const char *data);

protected:
    int socket_ = -1;
    const char *ip_;
    int port_;

private:
    static Socket *inst_; // The one, single instance
    Socket();
    Socket(const Socket &);
    Socket &operator=(const Socket &);
};
