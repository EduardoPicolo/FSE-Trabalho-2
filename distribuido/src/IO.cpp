#include "IO.hpp"

IO::IO() {}
IO::IO(std::vector<component> inputs, std::vector<component> outputs)
{
    inputComponents_ = inputs;
    outputComponents_ = outputs;
}

std::vector<component> IO::getInputs()
{
    return inputComponents_;
}
std::vector<component> IO::getOutputs()
{
    return outputComponents_;
}

IO::~IO() {}