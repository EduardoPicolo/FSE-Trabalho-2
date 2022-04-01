#include <Socket.hpp>
#include <Exception.hpp>

using namespace std;

Socket::Socket()
{
}

// Define the static Socket pointer
Socket *Socket::inst_ = NULL;

Socket *Socket::getInstance()
{
    if (inst_ == NULL)
    {
        inst_ = new Socket();
    }
    return (inst_);
}

void Socket::connectSocket(char const *ip, int port)
{
    if (socket_)
    {
        Socket::closeConnection();
    }

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

    cout << "Connecting to " << ip << ':' << port << "... ";

    while (connect(socket_,
                   servinfo->ai_addr,
                   servinfo->ai_addrlen) < 0)
    {
        cerr << "Failed." << endl;
        sleep(3);
        cout << "Connecting to " << ip << ':' << port << "... ";
    }

    cout << " ✓ Connected" << endl;
}

int Socket::getConnection()
{
    return socket_;
}

void Socket::closeConnection()
{
    shutdown(socket_, SHUT_RDWR);
    close(socket_);
}

std::string Socket::readData()
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

void Socket::sendData(const char *data)
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
