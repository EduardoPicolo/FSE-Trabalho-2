#include "ServerConfig.hpp"

using namespace std;

void ServerConfig::getNameJSON(cJSON *config_json)
{
    cJSON *name_json = cJSON_GetObjectItemCaseSensitive(config_json, "nome");
    name_ = name_json->valuestring;
}

void ServerConfig::getAddressJSON(cJSON *config_json)
{
    cJSON *ip_json = cJSON_GetObjectItemCaseSensitive(config_json, "ip_servidor_central");
    cJSON *port_json = cJSON_GetObjectItemCaseSensitive(config_json, "porta_servidor_central");

    remoteAddress_.ip = ip_json->valuestring;
    remoteAddress_.port = port_json->valueint;
}

std::vector<component> getComponentsJSON(cJSON *config_json, std::string componentType)
{
    std::vector<component> components;

    cJSON *component_json = cJSON_GetObjectItem(config_json, componentType.c_str());

    for (int i = 0; i < cJSON_GetArraySize(component_json); i++)
    {
        cJSON *data = cJSON_GetArrayItem(component_json, i);
        struct component tempComponent;
        tempComponent.type = cJSON_GetObjectItem(data, "type")->valuestring;
        tempComponent.tag = cJSON_GetObjectItem(data, "tag")->valuestring;
        tempComponent.gpio = cJSON_GetObjectItem(data, "gpio")->valueint;

        components.push_back(tempComponent);
    }

    return components;
}

ServerConfig::ServerConfig(const char *path, IO *io)
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

        getNameJSON(config_json);
        getAddressJSON(config_json);

        getComponentsJSON(config_json, "inputs");

        io = new IO(getComponentsJSON(config_json, "inputs"), getComponentsJSON(config_json, "outputs"));

        cout << "Config file loaded" << endl;
    }
    else
    {
        cout << "Failed to open config file: " << path << endl;
        exit(0);
    }

    fs.close();
}

std::string ServerConfig::getName()
{
    return name_;
}

ServerConfig::~ServerConfig()
{
}