// Server side C/C++ program to demonstrate Socket programming
#include <unistd.h>
#include <stdio.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <string>

// #include "../inc/socket.hpp"
#include <socket.hpp>
// #define PORT 8080

using namespace std;

Singleton *Singleton::instance_ = 0;

Singleton &Singleton::Instance(char const *ip, char const *port)
{
    if (instance_ == 0)
    {
        instance_ = new Singleton(ip, port);
    }
    return *instance_;
}

Singleton::Singleton(char const *ip, char const *port)
{
    struct addrinfo hints;
    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    struct addrinfo *servinfo;
    int status = getaddrinfo(ip, port,
                             &hints, &servinfo);

    if ((socket_ = socket(servinfo->ai_family,
                          servinfo->ai_socktype,
                          servinfo->ai_protocol)) < 0)
    {
        printf("\nSocket creation error \n");
        exit(1);
    }

    connect(socket_,
            servinfo->ai_addr,
            servinfo->ai_addrlen);
}

int Singleton::getConnection()
{
    return socket_;
};
