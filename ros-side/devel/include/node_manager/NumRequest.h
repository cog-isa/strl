// Generated by gencpp from file node_manager/NumRequest.msg
// DO NOT EDIT!


#ifndef NODE_MANAGER_MESSAGE_NUMREQUEST_H
#define NODE_MANAGER_MESSAGE_NUMREQUEST_H


#include <string>
#include <vector>
#include <map>

#include <ros/types.h>
#include <ros/serialization.h>
#include <ros/builtin_message_traits.h>
#include <ros/message_operations.h>


namespace node_manager
{
template <class ContainerAllocator>
struct NumRequest_
{
  typedef NumRequest_<ContainerAllocator> Type;

  NumRequest_()
    {
    }
  NumRequest_(const ContainerAllocator& _alloc)
    {
    }






  typedef boost::shared_ptr< ::node_manager::NumRequest_<ContainerAllocator> > Ptr;
  typedef boost::shared_ptr< ::node_manager::NumRequest_<ContainerAllocator> const> ConstPtr;

}; // struct NumRequest_

typedef ::node_manager::NumRequest_<std::allocator<void> > NumRequest;

typedef boost::shared_ptr< ::node_manager::NumRequest > NumRequestPtr;
typedef boost::shared_ptr< ::node_manager::NumRequest const> NumRequestConstPtr;

// constants requiring out of line definition



template<typename ContainerAllocator>
std::ostream& operator<<(std::ostream& s, const ::node_manager::NumRequest_<ContainerAllocator> & v)
{
ros::message_operations::Printer< ::node_manager::NumRequest_<ContainerAllocator> >::stream(s, "", v);
return s;
}

} // namespace node_manager

namespace ros
{
namespace message_traits
{



// BOOLTRAITS {'IsFixedSize': True, 'IsMessage': True, 'HasHeader': False}
// {'std_msgs': ['/opt/ros/indigo/share/std_msgs/cmake/../msg']}

// !!!!!!!!!!! ['__class__', '__delattr__', '__dict__', '__doc__', '__eq__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_parsed_fields', 'constants', 'fields', 'full_name', 'has_header', 'header_present', 'names', 'package', 'parsed_fields', 'short_name', 'text', 'types']




template <class ContainerAllocator>
struct IsFixedSize< ::node_manager::NumRequest_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsFixedSize< ::node_manager::NumRequest_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::node_manager::NumRequest_<ContainerAllocator> >
  : TrueType
  { };

template <class ContainerAllocator>
struct IsMessage< ::node_manager::NumRequest_<ContainerAllocator> const>
  : TrueType
  { };

template <class ContainerAllocator>
struct HasHeader< ::node_manager::NumRequest_<ContainerAllocator> >
  : FalseType
  { };

template <class ContainerAllocator>
struct HasHeader< ::node_manager::NumRequest_<ContainerAllocator> const>
  : FalseType
  { };


template<class ContainerAllocator>
struct MD5Sum< ::node_manager::NumRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "d41d8cd98f00b204e9800998ecf8427e";
  }

  static const char* value(const ::node_manager::NumRequest_<ContainerAllocator>&) { return value(); }
  static const uint64_t static_value1 = 0xd41d8cd98f00b204ULL;
  static const uint64_t static_value2 = 0xe9800998ecf8427eULL;
};

template<class ContainerAllocator>
struct DataType< ::node_manager::NumRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "node_manager/NumRequest";
  }

  static const char* value(const ::node_manager::NumRequest_<ContainerAllocator>&) { return value(); }
};

template<class ContainerAllocator>
struct Definition< ::node_manager::NumRequest_<ContainerAllocator> >
{
  static const char* value()
  {
    return "\n\
";
  }

  static const char* value(const ::node_manager::NumRequest_<ContainerAllocator>&) { return value(); }
};

} // namespace message_traits
} // namespace ros

namespace ros
{
namespace serialization
{

  template<class ContainerAllocator> struct Serializer< ::node_manager::NumRequest_<ContainerAllocator> >
  {
    template<typename Stream, typename T> inline static void allInOne(Stream&, T)
    {}

    ROS_DECLARE_ALLINONE_SERIALIZER;
  }; // struct NumRequest_

} // namespace serialization
} // namespace ros

namespace ros
{
namespace message_operations
{

template<class ContainerAllocator>
struct Printer< ::node_manager::NumRequest_<ContainerAllocator> >
{
  template<typename Stream> static void stream(Stream&, const std::string&, const ::node_manager::NumRequest_<ContainerAllocator>&)
  {}
};

} // namespace message_operations
} // namespace ros

#endif // NODE_MANAGER_MESSAGE_NUMREQUEST_H
