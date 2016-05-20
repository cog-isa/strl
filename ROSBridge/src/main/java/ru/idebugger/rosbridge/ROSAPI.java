package ru.idebugger.rosbridge;

import edu.wpi.rail.jrosbridge.Ros;
import edu.wpi.rail.jrosbridge.Service;
import edu.wpi.rail.jrosbridge.Topic;
import edu.wpi.rail.jrosbridge.callback.TopicCallback;
import edu.wpi.rail.jrosbridge.messages.Message;
import edu.wpi.rail.jrosbridge.services.ServiceRequest;
import edu.wpi.rail.jrosbridge.services.ServiceResponse;

/**
 * Created by artsobes on 19.05.16.
 */
public class ROSAPI {

  public static void main(String[] args) throws Exception {

    Ros ros = new Ros("localhost");
    ros.connect();

    Topic echo = new Topic(ros, "/create_world", "std_msgs/String");
    Message toSend = new Message("{\"data\": \"2\"}");
    echo.publish(toSend);

    Thread.sleep(1000);

    /*
    Service addTwoInts = new Service(ros, "/add_two_ints", "rospy_tutorials/AddTwoInts");

    ServiceRequest request = new ServiceRequest("{\"a\": 10, \"b\": 20}");
    ServiceResponse response = addTwoInts.callServiceAndWait(request);
    System.out.println(response.toString());
    */

    ros.disconnect();

  }

}
