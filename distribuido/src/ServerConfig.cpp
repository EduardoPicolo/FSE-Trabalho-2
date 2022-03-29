#include "ServerConfig.hpp"

using namespace std;

ServerConfig::ServerConfig(const char *path)
{
    std::ifstream fs;
    fs.open(path);

    if (fs.is_open())
    {
        std::stringstream buffer;
        buffer << fs.rdbuf();

        cJSON *config_json = cJSON_Parse(buffer.str().c_str());

        std::string ss = cJSON_Print(config_json);
        config_ == ss;
        cout << "Config file loaded" << endl;
    }
    else
    {
        cout << "Failed to open config file: " << path << endl;
        exit(0);
    }

    fs.close();
}

ServerConfig::~ServerConfig()
{
}