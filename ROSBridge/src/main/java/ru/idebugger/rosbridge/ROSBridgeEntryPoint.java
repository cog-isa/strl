package ru.idebugger.rosbridge;

import edu.wpi.rail.jrosbridge.Ros;
import edu.wpi.rail.jrosbridge.Topic;
import edu.wpi.rail.jrosbridge.messages.Message;
import py4j.GatewayServer;

/** Created by artsobes on 19.05.16. */

public class ROSBridgeEntryPoint {

  public static class ROSBridge {
    Ros ros = new Ros("localhost");

    { ros.connect(); }

    public void publish(String topic, String type, String data) {
      Topic t = new Topic(ros, topic, type);
      Message message = new Message(data);
      t.publish(message);
    }

  }

  public static void main(String[] args) throws Exception {
    GatewayServer gatewayServer = new GatewayServer(new ROSBridge());
    gatewayServer.start();

    System.out.println("Gateway Server Started");
  }

}
