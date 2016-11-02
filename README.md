#Текущая структура

###ROS

Все что касается ROS части проекта размещено в каталоге `ros-side`.

```
ros-side/
  build/
  devel/
  src/
    node_manager/
    robots/
```

В папке `src` размещаются ROS-проекты:

- **node\_manager**

    ```
    node_manager/
      nodes/
        manager.py
      src/
        node_manager/
          helpers/
          nodes/
          objects/
          sensors/
          environment.py
          world.py
      srv/
    ```

    `nodes/manager.py` --- исполняемый ROSом код.
    Инициализирует ROS-узел NodeManager и создает 2 ROS-топика, которые отвечают за запуск и остановку процессов моделирования.

    `src/node_manager/` --- исходные коды NodeManager'а.

    - `world.py` --- описывает класс World, который предоставляет API для инициализации A и E блоков и непосредственного взаимодействия с ними.
    - `environment.py` --- описывает класс Environment (E-блок), создает соответствующий ROS-узел и обеспечивает с ним взаимодействие.
    - `objects/` --- классы объектов, участвующих в моделировании.
    - `nodes/` --- классы ROS-узлов (R, S, T) робота A-блока.
    - `sensors/` --- классы сенсоров.
    - `helpers/` --- всякие тулзы, которые мне показалось удобнее вынести сюда.

    `srv/` --- здесь описываются структуры данных для обмена между ROS-сервисами.

- **robots**

    ```
    robots/
      nodes/
        env.py
        runner.py
      scripts/
      src/
    ```

    - `nodes/env.py` --- создает E ROS-узел и занимается всем с ним связанным.
    - `nodes/runner.py` --- создает один из R, S, T ROS-узлов.
    - `scripts/` --- исходные коды R, S, T узлов.
    - `src/robots` --- либа для роботов. API для вазимодействия с E-блоком, сенсорами, актуаторами и прочим.

###Web-server

Лежит все в `web-side/serv/`.

```
web-side/serv/
  controllers/
  models/
  static/
  templates/
  app.py
  main.py

```

Сделано по MVP:

- `controllers/` --- контроллеры проекта
- `models/` --- модели
- `templates/` --- вьюхи

Насколько мне известно вся эта часть будет переделана полностью.

###Bridge

Это Java-приложение, которое служит мостом между веб-сервером и сервером ROS. Через него мы передаем данные в ROS-часть.

#Запуск

Исполняем сетап файлы кинетика и наших ROS проектов
```
source /opt/ros/kinetic/setup.bash
source ros-side/devel/setup.bash
```

Запускаем ROS-сервер
```
roscore
```

Запускаем NodeManager
```
rosrun node_manager manager.py
```

Запускаем rosbridge-server
```
roslaunch rosbridge_server rosbridge_websocket.launch
```

Запускаем мост
```
java -jar ROSBridge/out/artifacts/ROSBridge_jar/ROSBridge.jar
```

Запускаем Web-сервер
```
python web-side/serv/main.py
```

-------

Все команды прописаны в `run.sh`. Так что достаточно его исполнить.
```
bash run.sh
```

-------

После успешного старта всех приложений можно ознакомиться с тестовым примером работы всей системы по адресу:
```
:5000/worlds/1
```
