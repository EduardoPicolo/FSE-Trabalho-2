#include "ComponentsWorker.hpp"

EventController *ComponentsWorker::event_ = nullptr;
int ComponentsWorker::presenceSensor_ = 0;
int ComponentsWorker::smokeSensor_ = 0;
int ComponentsWorker::window01_ = 0;
int ComponentsWorker::window02_ = 0;
int ComponentsWorker::door_ = 0;
int ComponentsWorker::totalPeople_ = 0;
int ComponentsWorker::peopleGroundFloor_ = 0;
int ComponentsWorker::peopleFirstFloor_ = 0;
int ComponentsWorker::bulb01_ = 0;
int ComponentsWorker::bulb02_ = 0;
int ComponentsWorker::bulbCorridor_ = 0;
int ComponentsWorker::AC_ = 0;
int ComponentsWorker::sprinkler_ = 0;

ComponentsWorker::ComponentsWorker(IO *io, EventController *eventController)
{
    io_ = io;
    event_ = eventController;
}

void ComponentsWorker::start()
{
    wiringPiSetup();

    for (component component : io_->getInputs())
    {
        component.gpio = io_->toWiringPiPin(component.gpio);
        pinMode(component.gpio, INPUT);
        int initialState = digitalRead(component.gpio);
        component.state = initialState;
        event_->sendEvent(event_->createEvent(component.type.c_str(), std::to_string(initialState).c_str()));
        initInputWorker(component);
        sleep(1); // sending to many events at the same time can cause issues to the NodeJS Buffer
    }

    for (component component : io_->getOutputs())
    {
        component.gpio = io_->toWiringPiPin(component.gpio);
        pinMode(component.gpio, OUTPUT);
        int initialState = digitalRead(component.gpio);
        component.state = initialState;
        event_->sendEvent(event_->createEvent(component.type.c_str(), std::to_string(initialState).c_str()));
        initOutputWorker(component);
        sleep(1); // sending to many events at the same time can cause issues to the NodeJS Buffer
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
    else if (component.type == "contagem")
    {
        // return CountEnterHandler;
        // wiringPiISR(23, INT_EDGE_BOTH, (void (*)())getComponentHandler("contagem"));
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

void ComponentsWorker::initOutputWorker(component component)
{

    if (component.type.find("lampada") != std::string::npos)
    {
        if (component.tag.find("01") != std::string::npos)
        {
            bulb01_ = component.state;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Bulb01Handler);
        }
        else if (component.tag.find("02") != std::string::npos)
        {
            bulb02_ = component.state;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, Bulb02Handler);
        }
        else
        {
            bulbCorridor_ = component.state;
            wiringPiISR(component.gpio, INT_EDGE_BOTH, BulbCorridorHandler);
        }
    }
    else if (component.type == "ar-condicionado")
    {
        AC_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, ACHandler);
    }
    else if (component.type == "aspersor")
    {
        sprinkler_ = component.state;
        wiringPiISR(component.gpio, INT_EDGE_BOTH, SprinklerHandler);
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
void ComponentsWorker::Bulb01Handler()
{
    if (bulb01_ == 0)
    {
        bulb01_ = 1;
        std::cout << "Lâmpada da Sala 01 aberta" << std::endl;
    }
    else if (bulb01_ == 1)
    {
        bulb01_ = 0;
        std::cout << "Lâmpada da Sala 01 fechada" << std::endl;
    }

    std::string eventType = "lampada 01";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(bulb01_).c_str()));
}
void ComponentsWorker::Bulb02Handler()
{
    if (bulb02_ == 0)
    {
        bulb02_ = 1;
        std::cout << "Lâmpada da Sala 02 aberta" << std::endl;
    }
    else if (bulb02_ == 1)
    {
        bulb02_ = 0;
        std::cout << "Lâmpada da Sala 02 fechada" << std::endl;
    }

    std::string eventType = "lampada 02";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(bulb02_).c_str()));
}
void ComponentsWorker::BulbCorridorHandler()
{
    if (bulbCorridor_ == 0)
    {
        bulbCorridor_ = 1;
        std::cout << "Lâmpada do Corredor aberta" << std::endl;
    }
    else if (bulbCorridor_ == 1)
    {
        bulbCorridor_ = 0;
        std::cout << "Lâmpada do Corredor fechada" << std::endl;
    }

    std::string eventType = "lampada 03";

    event_->sendEvent(event_->createEvent(eventType.c_str(), std::to_string(bulbCorridor_).c_str()));
}
void ComponentsWorker::ACHandler()
{
    if (AC_ == 0)
    {
        AC_ = 1;
        std::cout << "Ar-condicionado ligado" << std::endl;
    }
    else if (AC_ == 1)
    {
        AC_ = 0;
        std::cout << "Ar-condicionado desligado" << std::endl;
    }

    event_->sendEvent(event_->createEvent("ar-condicionado", std::to_string(AC_).c_str()));
}
void ComponentsWorker::SprinklerHandler()
{
    if (sprinkler_ == 0)
    {
        sprinkler_ = 1;
        std::cout << "Aspersor ligado" << std::endl;
    }
    else if (sprinkler_ == 1)
    {
        sprinkler_ = 0;
        std::cout << "Aspersor desligado" << std::endl;
    }

    event_->sendEvent(event_->createEvent("aspersor", std::to_string(sprinkler_).c_str()));
}

ComponentsWorker::~ComponentsWorker() {}
