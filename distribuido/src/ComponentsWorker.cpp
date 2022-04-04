#include "ComponentsWorker.hpp"

EventController *ComponentsWorker::event_ = nullptr;
int ComponentsWorker::presenceSensor_ = 0;
int ComponentsWorker::smokeSensor_ = 0;
int ComponentsWorker::window01_ = 0;
int ComponentsWorker::window02_ = 0;
int ComponentsWorker::door_ = 0;
int ComponentsWorker::totalOccupation_ = 0;
int ComponentsWorker::totalGroundFloor_ = 0;
int ComponentsWorker::totalFirstFloor_ = 0;

ComponentsWorker::ComponentsWorker(IO *io, EventController *eventController, component dht22)
{
    io_ = io;
    event_ = eventController;
    dht22_ = dht22;
}

void ComponentsWorker::start()
{

    for (component component : io_->getInputs())
    {
        pinMode(component.gpio, INPUT);
        int initialState = digitalRead(component.gpio);
        component.state = initialState;
        event_->sendEvent(event_->createEvent(component.type.c_str(), std::to_string(initialState).c_str()));
        initInputWorker(component);
        delay(50); // sending to many events at the same time can cause issues to the NodeJS Buffer
    }

    for (component component : io_->getOutputs())
    {
        pinMode(component.gpio, OUTPUT);
        digitalWrite(component.gpio, LOW);
        int initialState = 0;
        component.state = initialState;
        event_->sendEvent(event_->createEvent(component.type.c_str(), std::to_string(initialState).c_str()));
        delay(50); // sending to many events at the same time can cause issues to the NodeJS Buffer
    }
}

void ComponentsWorker::DHT22Worker()
{

    std::cout << "DHT22Worker starting..." << std::endl;

    while (1)
    {
        DHT22_data data = read_dht_data(dht22_.gpio);
        std::string payload = "{\"temperature\":" + std::to_string(data.temperature) + ",\"humidity\":" + std::to_string(data.humidity) + "}";
        event_->sendEvent(event_->createEvent("dht", payload.c_str()));
        sleep(1);
    }
}

void ComponentsWorker::initInputWorker(component component)
{
    if (component.type == "presenca")
    {
        presenceSensor_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, PresenceSensorHandler);
    }
    else if (component.type == "fumaca")
    {
        smokeSensor_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, SmokeSensorHandler);
    }
    else if (component.type.find("contagem") != std::string::npos)
    {
        if (component.type.find("entradaPredio") != std::string::npos)
        {
            wiringPiISR(component.gpio, INT_EDGE_RISING, CountEnterHandler);
        }
        else if (component.type.find("saidaPredio") != std::string::npos)
        {
            wiringPiISR(component.gpio, INT_EDGE_RISING, CountExitHandler);
        }
        else if (component.type.find("entradaAndar") != std::string::npos)
        {
            wiringPiISR(component.gpio, INT_EDGE_RISING, CountFloorEnterHandler);
        }
        else if (component.type.find("saidaAndar") != std::string::npos)
        {
            wiringPiISR(component.gpio, INT_EDGE_RISING, CountFloorExitHandler);
        }
    }
    else if (component.type.find("janela") != std::string::npos)
    {
        if (component.tag.find("01") != std::string::npos)
        {
            window01_ = component.state;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Window01Handler);
        }
        else if (component.tag.find("02") != std::string::npos)
        {
            window02_ = component.state;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Window02Handler);
        }
    }
    else if (component.type == "porta")
    {
        door_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, DoorSensorHandler);
    }
}

void ComponentsWorker::Window01Handler()
{
    if (window01_ == 0)
    {
        window01_ = 1;
        std::cout << "Janela 01 aberta" << std::endl;
    }
    else if (window01_ == 1)
    {
        window01_ = 0;
        std::cout << "Janela 01 fechada" << std::endl;
    }

    std::string eventType = "janela 01";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(window01_).c_str()));
}
void ComponentsWorker::Window02Handler()
{
    if (window02_ == 0)
    {
        window02_ = 1;
        std::cout << "Janela 02 aberta" << std::endl;
    }
    else if (window02_ == 1)
    {
        window02_ = 0;
        std::cout << "Janela 02 fechada" << std::endl;
    }

    std::string eventType = "janela 02";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(window02_).c_str()));
}
void ComponentsWorker::DoorSensorHandler()
{
    if (door_ == 0)
    {
        door_ = 1;
        std::cout << "ensor de Porta Entrada Ligado" << std::endl;
    }
    else if (door_ == 1)
    {
        door_ = 0;
        std::cout << "Sensor de Porta Entrada desligado" << std::endl;
    }
    event_->sendEvent(event_->createEvent("porta", std::to_string(door_).c_str()));
}
void ComponentsWorker::PresenceSensorHandler()
{
    if (presenceSensor_ == 0)
    {
        presenceSensor_ = 1;
        std::cout << "Sensor de presença Ligado" << std::endl;
    }
    else if (presenceSensor_ == 1)
    {
        presenceSensor_ = 0;
        std::cout << "Sensor de preseça desligado" << std::endl;
    }
    event_->sendEvent(event_->createEvent("presenca", std::to_string(presenceSensor_).c_str()));
}
void ComponentsWorker::SmokeSensorHandler()
{
    if (smokeSensor_ == 0)
    {
        smokeSensor_ = 1;
        std::cout << "Sensor de fumaça Ligado" << std::endl;
    }
    else if (smokeSensor_ == 1)
    {
        smokeSensor_ = 0;
        std::cout << "Sensor de fumaça desligado" << std::endl;
    }
    event_->sendEvent(event_->createEvent("fumaca", std::to_string(smokeSensor_).c_str()));
}

void ComponentsWorker::CountEnterHandler()
{
    std::cout << "Predio: entrou 1" << std::endl;
    totalOccupation_++;
    totalGroundFloor_++;
    event_->sendEvent(event_->createEvent("contagemPredio", "1"));
    // event_->sendEvent(event_->createEvent("contagemPredio", std::to_string(totalOccupation_).c_str()));
    // usleep(500000);
    // event_->sendEvent(event_->createEvent("contagemTerreo", std::to_string(totalGroundFloor_).c_str()));
}
void ComponentsWorker::CountExitHandler()
{
    std::cout << "Predio: saiu 1" << std::endl;
    totalOccupation_--;
    totalGroundFloor_--;
    event_->sendEvent(event_->createEvent("contagemPredio", "-1"));
    // event_->sendEvent(event_->createEvent("contagemPredio", std::to_string(totalOccupation_).c_str()));
    // usleep(500000);
    // event_->sendEvent(event_->createEvent("contagemTerreo", std::to_string(totalGroundFloor_).c_str()));
}
void ComponentsWorker::CountFloorEnterHandler()
{
    std::cout << "Andar: entrou 1" << std::endl;
    totalFirstFloor_++;
    totalGroundFloor_--;
    event_->sendEvent(event_->createEvent("contagemAndar", "1"));
    // event_->sendEvent(event_->createEvent("contagemAndar", std::to_string(totalFirstFloor_).c_str()));
    // usleep(500000);
    // event_->sendEvent(event_->createEvent("contagemPredio", std::to_string(totalGroundFloor_).c_str()));
}
void ComponentsWorker::CountFloorExitHandler()
{
    std::cout << "Andar: saiu 1" << std::endl;
    totalFirstFloor_--;
    totalGroundFloor_++;
    event_->sendEvent(event_->createEvent("contagemAndar", "-1"));
    // event_->sendEvent(event_->createEvent("contagemAndar", std::to_string(totalFirstFloor_).c_str()));
    // usleep(500000);
    // event_->sendEvent(event_->createEvent("contagemTerreo", std::to_string(totalGroundFloor_).c_str()));
}

ComponentsWorker::~ComponentsWorker() {}
