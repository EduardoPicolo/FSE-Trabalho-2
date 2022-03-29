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

#include <semaphore.h>

#include "cJSON.h"

// #pragma once

// singleton.hpp
#ifndef SINGLETON_HPP
#define SINGLETON_HPP

class Singleton
{
public:
    static Singleton &Instance(char const *ip, char const *port);
    int getConnection();

private:
    Singleton(char const *ip, char const *port);
    static Singleton *instance_;
    int socket_;
};

#endif

// Socket *Socket::instance = 0;

// Socket *Socket::singleton_ = nullptr;
// static Socket *GetInstance(const char *ip, const char *port);
// Socket *Socket::GetInstance(const char *ip, const char *port);