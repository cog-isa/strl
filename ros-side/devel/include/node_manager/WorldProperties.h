// Generated by gencpp from file node_manager/WorldProperties.msg
// DO NOT EDIT!


#ifndef NODE_MANAGER_MESSAGE_WORLDPROPERTIES_H
#define NODE_MANAGER_MESSAGE_WORLDPROPERTIES_H

#include <ros/service_traits.h>


#include <node_manager/WorldPropertiesRequest.h>
#include <node_manager/WorldPropertiesResponse.h>


namespace node_manager
{

struct WorldProperties
{

typedef WorldPropertiesRequest Request;
typedef WorldPropertiesResponse Response;
Request request;
Response response;

typedef Request RequestType;
typedef Response ResponseType;

}; // struct WorldProperties
} // namespace node_manager


namespace ros
{
namespace service_traits
{


template<>
struct MD5Sum< ::node_manager::WorldProperties > {
  static const char* value()
  {
    return "759c4fee420177dccb03972d95304e0e";
  }

  static const char* value(const ::node_manager::WorldProperties&) { return value(); }
};

template<>
struct DataType< ::node_manager::WorldProperties > {
  static const char* value()
  {
    return "node_manager/WorldProperties";
  }

  static const char* value(const ::node_manager::WorldProperties&) { return value(); }
};


// service_traits::MD5Sum< ::node_manager::WorldPropertiesRequest> should match 
// service_traits::MD5Sum< ::node_manager::WorldProperties > 
template<>
struct MD5Sum< ::node_manager::WorldPropertiesRequest>
{
  static const char* value()
  {
    return MD5Sum< ::node_manager::WorldProperties >::value();
  }
  static const char* value(const ::node_manager::WorldPropertiesRequest&)
  {
    return value();
  }
};

// service_traits::DataType< ::node_manager::WorldPropertiesRequest> should match 
// service_traits::DataType< ::node_manager::WorldProperties > 
template<>
struct DataType< ::node_manager::WorldPropertiesRequest>
{
  static const char* value()
  {
    return DataType< ::node_manager::WorldProperties >::value();
  }
  static const char* value(const ::node_manager::WorldPropertiesRequest&)
  {
    return value();
  }
};

// service_traits::MD5Sum< ::node_manager::WorldPropertiesResponse> should match 
// service_traits::MD5Sum< ::node_manager::WorldProperties > 
template<>
struct MD5Sum< ::node_manager::WorldPropertiesResponse>
{
  static const char* value()
  {
    return MD5Sum< ::node_manager::WorldProperties >::value();
  }
  static const char* value(const ::node_manager::WorldPropertiesResponse&)
  {
    return value();
  }
};

// service_traits::DataType< ::node_manager::WorldPropertiesResponse> should match 
// service_traits::DataType< ::node_manager::WorldProperties > 
template<>
struct DataType< ::node_manager::WorldPropertiesResponse>
{
  static const char* value()
  {
    return DataType< ::node_manager::WorldProperties >::value();
  }
  static const char* value(const ::node_manager::WorldPropertiesResponse&)
  {
    return value();
  }
};

} // namespace service_traits
} // namespace ros

#endif // NODE_MANAGER_MESSAGE_WORLDPROPERTIES_H
