#ifndef EXCEPTION_HPP
#define EXCEPTION_HPP

#include <exception>

class Exception : public std::exception
{
private:
    Exception();
    const char *message;

public:
    Exception(const char *msg);
    const char *what();
};

extern const Exception connectionError;

#endif