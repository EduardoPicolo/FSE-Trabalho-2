#include <Socket.hpp>
#include <Exception.hpp>

using namespace std;

Singleton::Singleton()
{
}

// Define the static Singleton pointer
Singleton *Singleton::inst_ = NULL;

Singleton *Singleton::getInstance()
{
    if (inst_ == NULL)
    {
        inst_ = new Singleton();
    }
    return (inst_);
}

void Singleton::connectSocket(char const *ip, int port, int retryCount)
{
    if (socket_)
    {
        Singleton::closeConnection();
    }

    cout << "Connecting to address " << ip << ':' << port << "... ";

    ip_ = ip;
    port_ = port;

    struct addrinfo hints;
    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    struct addrinfo *servinfo;

    getaddrinfo(ip, to_string(port).c_str(),
                &hints, &servinfo);

    if ((socket_ = socket(servinfo->ai_family,
                          servinfo->ai_socktype,
                          servinfo->ai_protocol)) < 0)
    {
        printf("\nSocket creation error \n");
        exit(1);
    }

    int connected = connect(socket_,
                            servinfo->ai_addr,
                            servinfo->ai_addrlen);

    if (connected < 0)
    {
        if (retryCount < 5)
        {
            cerr << "Failed." << endl;
            retryCount++;
            sleep(3);
            Singleton::connectSocket(ip, port, retryCount);
        }
        else
        {
            throw connectionError;
        }
    }
    else
    {
        cout << " ✓ Connected" << endl;
    }
}

int Singleton::getConnection()
{
    return socket_;
}

void Singleton::closeConnection()
{
    shutdown(socket_, SHUT_RDWR);
    close(socket_);
}

std::string Singleton::readData()
{
    int bytes = 0;
    char buffer[1024] = {0};
    // if (is_ready(socket_))
    // {
    // }
    cout << "WAITING FOR DATA..." << endl;
    bytes = read(socket_, buffer, 1024); // this is a blocking call
    if (bytes < 0)
    {
        cerr << "Error reading from socket" << endl;
        exit(1);
    }
    std::string data = std::string(buffer, bytes);
    std::cout << "RECEIVED: " << data << std::endl;
    return data;
}

void Singleton::sendData(const char *data)
{
    send(socket_, data, strlen(data), 0);
}

int is_ready(int fd)
{
    fd_set fdset;
    struct timeval timeout;
    FD_ZERO(&fdset);
    FD_SET(fd, &fdset);

    timeout.tv_sec = 0;
    timeout.tv_usec = 1;

    return select(fd + 1, &fdset, NULL, NULL, &timeout) == 1;
}
