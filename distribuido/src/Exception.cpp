#include "Exception.hpp"

Exception::Exception() {}

Exception::Exception(const char *msg) : message(msg)
{
}

const char *Exception::what()
{
    return message;
}

const Exception connectionError("Error connecting to socket");