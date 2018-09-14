+++
title = "Cluster Administration & Operations"
weight = 6
+++

The cluster operation control command interpreter (hereinafter referred to gs_sh) is a command line interface tool to manage GridDB cluster operations and data operations.

The following can be carried out by gs_sh.

*   Operation control of GridDB cluster
    *   Definition of GridDB cluster
    *   Starting and stopping a GridDB node and cluster
    *   Status, log display
*   GridDB cluster data operation
    *   Database and user management
    *   Collection, trigger display
    *   Index setting, deletion
    *   Search using a tql/sql

**\[Memo\]**

*   All functions provided in the GridDB operating commands are planned to be provided as gs\_sh subcommands. Where possible, use of gs\_sh is recommended as there is a possibility that the operating commands may be deleted in future releases. See the chapter on “Operating Commands” for details of the operating commands.

### Using gs_sh

### Preliminary Preparations

Carry out the following preparations before using gs_sh.

*   GridDB setup
    
    *   Installation of GridDB node, client library
    *   User creation
    *   Network setting (GridDB cluster definition file, node definition file)
    
    　See the chapter on “System Design & Construction” in the “GridDB Quick Start Guide” ([GridDB_QuickStartGuide.html](/en/docs/manuals/v3.1/GridDB_QuickStartGuide.html)) for details on the procedure.
    
*   Remote connection setting using SSH
    
    *   This setting is necessary in order to connect to each GridDB node execution environment from the gs_sh execution environment as an OS user “gsadm”.
    
    　*See the manual of each OS for details on the SSH connection procedure.
    

### gs_sh start-up

There are two types of start modes in gs_sh.

*   Startup in interactive mode
    
    *   The interactive mode is started when gs\_sh is executed without any arguments. The gs\_sh prompt will appear, allowing subcommands to be entered.
    *   Example:
    
    $ gs_sh
    // execution of subcommand “version”
    gs> version
    gs_sh version 2.0.0
    
    **\[Memo\]**
    
    *   When a subcommand is started in the interactive mode,
        *   a .gssh_history file is created in the home directory of the execution user and saved in the history.
        *   Click the arrow key to display/execute up to 20 subcommands started earlier.
        *   Enter some of the subcommands and click the Tab key to display a list of the subcommand input candidates.
*   Startup in batch mode
    
    *   When the script file for user creation is specified in gs\_sh, the system will be started in the batch mode. Batch processing of a series of subcommands described in the script file will be carried out. gs\_sh will terminate at the end of the batch processing.
    *   Example:
    
    // specify the script file (test.gsh) and execute
    $ gs_sh test.gsh
    

**\[Memo\]**

*   Execute gs_sh commands as the OS user “gsadm”.
*   During gs_sh startup, .gsshrc script files under the gsadm user home directory are imported automatically. The .gsshrc contents will also be imported to the destination from other script files.
*   Extension of script file is gsh.
*   A script file is described using the character code UTF-8.

### Definition of a GridDB Cluster

The definition below is required in advance when executing a GridDB cluster operation control or data operation.

*   Define each node data in the node variable
*   Use the node variable to define the GridDB cluster configuration in the cluster variable
*   Define the user data of the GridDB cluster

An explanation of node variables, cluster variables, and how to define user data is given below. An explanation of the definition of an arbitrary variable, display of variable definition details, and how to save and import variable definition details in a script file is also given below.

### Definition of Node Variable

Define the IP address and port no. of a GridDB node in the node variable.

*   Subcommand
    
      
    
    setnode
    
    Node variable name IP address and port no. \[SSH port no.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable name
    
    Specify the node variable name. If the same variable name already exists, its definition will be overwritten.
    
    IP address
    
    Specify the IP address of the GridDB node (for connecting operation control tools).
    
    Port no.
    
    Specify the port no. of the GridDB node (for connecting operation control tools).
    
    SSH port no.
    
    Specify the SSH port number. Number 22 is used by default.
    
*   Example:
    
    //Define 4 GridDB nodes
    gs> setnode node0 192.168.0.1 10000
    gs> setnode node1 192.168.0.2 10000
    gs> setnode node2 192.168.0.3 10000
    gs> setnode node3 192.168.0.4 10000
    

**\[Memo\]**

*   Only single-byte alphanumeric characters and the symbol "_" can be used in the node variable name.
*   Check the GridDB node “IP address” and “port no. ” for connecting the operation control tools in the node definition file of each tool.
    *   “IP address”: /system/serviceAddress
    *   “Port no.” : /system/servicePort

### Definition of Cluster Variable

Define the GridDB cluster configuration in the cluster variable.

*   Subcommand
    
      
    
    setcluster
    
    <Cluster variable name> <Cluster name> <Multicast address> <Port no.> \[< Node variable>...\]
    
    setcluster
    
    <Cluster variable name> <Cluster name> FIXED_LIST < Address list of fixed list method> \[<Node variable>...\]
    
    setcluster
    
    <Cluster variable name> <Cluster name> PROVIDER <URL of provider method> \[<Node variable>...\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable name
    
    Specify the cluster variable name. If the same variable name already exists, its definition will be overwritten.
    
    Cluster name
    
    Specify the cluster name.
    
    Multicast address
    
    \[For the multicast method\] Specify the GridDB cluster multicast address (for client connection).
    
    Port no.
    
    \[For the multicast method\] Specify the GridDB cluster multicast port no. (for client connection).
    
    Node variable
    
    Specify the nodes constituting a GridDB cluster with a node variable.
    
    When using a cluster variable in a data operation subcommand, the node variable may be omitted.
    
    Address list of fixed list method
    
    \[For fixed list method\] Specify the list of transaction addresses and ports for cluster.notificationMember in gs_cluster.json Example: 192.168.15.10:10001,192.168.15.11:10001
    
    URL of provider method
    
    \[For provider method\] Specify the value of cluster.notificationProvider in gs_cluster.json.
    
*   Example:
    
    // define the GridDB cluster configuration
    gs> setcluster cluster0 name 200.0.0.1 1000 $node0 $node1 $node2
    

**\[Memo\]**

*   Only single-byte alphanumeric characters and the symbol "_" can be used in the cluster variable name.
*   Append "$" in front of the variable name when using a node variable.
*   Check the “cluster name”, “multicast address” and “port no.” defined in a cluster variable in the cluster definition file of each GridDB node.
    
    *   “Cluster name”: /clustergs/clusterName
    *   “Multicast address”: /transaction/notificationAddress
    *   “Port no.”: /transaction/notificationPort
    
    *All settings in the cluster definition file of a node constituting a GridDB cluster have to be configured the same way. If the settings are configured differently, the cluster cannot be composed.
    

In addition, node variables can be added or deleted for a defined cluster variable.

*   Subcommand
    
      
    
    modcluster
    
    Add cluster variable name｜remove node variable name...
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable name
    
    Specify the name of a cluster variable to add or delete a node.
    
    add｜remove
    
    Specify add when adding a node variable, and remove when deleting a node variable.
    
    Node variable
    
    Specify a node variable to add or delete a cluster variable.
    
*   Example:
    
    //Add a node to a defined GridDB cluster configuration
    gs> modcluster cluster0 add $node3
    //Delete a node from a defined GridDB cluster configuration
    gs> modcluster cluster0 remove $node3
    

**\[Memo\]**

*   Append "$" in front of the variable name when using a node variable.

### Defining the SQL Connection Destination of a Cluster

Define the SQL connection destination in the GridDB cluster configuration. This is set up only when using the GridDB Advanced Edition NewSQL interface.

*   Subcommand
    
      
    
    setclustersql
    
    <Cluster variable name> <Cluster name> <SQL address> <SQL port no.>
    
    setclustersql
    
    <Cluster variable name> <Cluster name> FIXED_LIST < SQL address list of fixed list method>
    
    setclustersql
    
    <Cluster variable name> <Cluster name> PROVIDER <URL of provider method>
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable name
    
    Specify the cluster variable name. If the same variable name already exists, the SQL connection data will be overwritten.
    
    Cluster name
    
    Specify the cluster name.
    
    SQL address
    
    \[For multicast method\] Specify the reception address for the SQL client connection.
    
    SQL port no.
    
    \[For multicast method\] Specify the port no. for the SQL client connection.
    
    SQL address list of fixed list method
    
    \[For fixed list method\] Specify the list of sql addresses and ports for cluster.notificationMember in gs_cluster.json Example: 192.168.15.10:20001,192.168.15.11:20001
    
    URL of provider method
    
    \[For provider method\] Specify the value of cluster.notificationProvider in gs_cluster.json.
    
*   Example:
    
    //Definition method when using both NoSQL interface and NewSQL interface to connect to a NewSQL server
    gs> setcluster    cluster0 name 239.0.0.1 31999 $node0 $node1 $node2
    gs> setclustersql cluster0 name 239.0.0.1 41999
    

**\[Memo\]**

*   Only single-byte alphanumeric characters and the symbol "_" can be used in the cluster variable name.
*   This is set up only when using the GridDB Advanced Edition NewSQL interface.
*   When an existing cluster variable name is specified, only the section containing SQL connection data will be overwritten. When overwriting, the same method as the existing connection method needs to be specified.
*   Execute only this command when using SQL only.
*   Check the “SQL address” and “SQL port no.” defined in a cluster variable in the cluster definition file of each GridDB node.
    *   “SQL address”: /sql/notificationAddress
    *   “SQL port no.”: /sql/notificationPort

### Definition of a user

Define the user and password to access the GridDB cluster.

*   Subcommand
    
      
    
    setuser
    
    User name and password \[gsadm password\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    User name
    
    Specify the name of the user accessing the GridDB cluster.
    
    Password
    
    Specify the corresponding password.
    
    gsadm password
    
    Specify the password of the OS user gs_admin.
    
    This may be omitted if start node (startnode subcommand) is not going to be executed.
    
*   Example:
    
    //Define the user, password and gsadm password to access a GridDB cluster
    gs> setuser admin admin gsadm
    

**\[Memo\]**

*   The user definition is divided and stored in the variable below.
    
      
    
    Variable Name
    
    Storage data
    
    user
    
    User name
    
    password
    
    Password
    
    ospassword
    
    gsadm password
    
*   Multiple users cannot be defined. The user and password defined earlier will be overwritten. When operating multiple GridDB clusters in gs_sh, reset the user and password with the setuser subcommand every time the connection destination cluster is changed.

### Definition of arbitrary variables

Define an arbitrary variable.

*   Subcommand
    
      
    
    set
    
    Variable name \[value\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Variable Name
    
    Specify the variable name.
    
    Value
    
    Specify the setting value. The setting value of the variable concerned can be cleared by omitting the specification.
    
*   Example:
    
    // define variable
    gs> set GS_PORT 10000
    // clear variable settings
    gs> set GS_PORT
    

**\[Memo\]**

*   Node variable and cluster variable settings can also be cleared with the set subcommand.
*   Only single-byte alphanumeric characters and the symbol "_" can be used in the variable name.

### Displaying the variable definition

Display the detailed definition of the specified variable.

*   Subcommand
    
      
    
    show
    
    \[Variable name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Variable Name
    
    Specify the name of the variable to display the definition details. If the name is not specified, details of all defined variables will be displayed.
    
*   Example:
    
    //Display all defined variables
    gs> show
    Node variable:
      node0=Node\[192.168.0.1:10000,ssh=22\]
      node1=Node\[192.168.0.2:10000,ssh=22\]
      node2=Node\[192.168.0.3:10000,ssh=22\]
      node3=Node\[192.168.0.4:10000,ssh=22\]
    Cluster variable:
      cluster0=Cluster\[name=name,200.0.0.1:1000,nodes = (node0,node1,node2
    Other variables:
      user=admin
      password=*****
      ospassword=*****
    

**\[Memo\]**

*   Password character string will not appear. Display replaced by "*****".

### Saving a variable definition in a script file

Save the variable definition details in the script file.

*   Subcommand
    
      
    
    save
    
    \[Script file name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Script file name
    
    Specify the name of the script file serving as the storage destination. Extension of script file is gsh.
    
    If the name is not specified, the data will be saved in the .gsshrc file in the gsadm user home directory.
    
*   Example:
    
    // Save the defined variable in a file
    gs> save test.gsh
    

**\[Memo\]**

*   If the storage destination script file does not exist, a new file will be created. If the storage destination script file exists, the contents will be overwritten.
*   A script file is described using the character code UTF-8.
*   Contents related to the user definition (user, password, gsadm password) will not be output to the script file.
*   Contents in the .gsshrc script file will be automatically imported during gs_sh start-up.

### Executing a script file

Execute a read script file.

*   Subcommand
    
      
    
    load
    
    \[Script file name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Script file name
    
    Specify the script file to execute.
    
    If the script file is not specified, the .gsshrc file in the gsadm user home directory will be imported again.
    
*   Example:
    
    //execute script file
    gs> load test.gsh
    

**\[Memo\]**

*   Extension of script file is gsh.
*   A script file is described using the character code UTF-8.

### GridDB cluster operation controls

The following operations can be executed by the administrator user only as functions to manage GridDB cluster operations.

*   GridDB node start, stop, join cluster, leave cluster (startnode/stopnode/joincluster/leavecluster)
*   GridDB cluster operation start, operation stop (startcluster/stopcluster)
*   Increase the number of new nodes in a GridDB cluster (appendcluster)
*   Get various data

### Cluster status

This section explains the status of a GridDB node and GridDB cluster.

A cluster is composed of 1 or more nodes.  
The node status represents the status of the node itself e.g. start or stop etc.  
The cluster status represents the acceptance status of data operations from a client. Cluster statuses are determined according to the status of the node group constituting the cluster.

An example of the change in the node status and cluster status due to a gs_sh subcommand operation is shown below.  
A cluster is composed of 4 nodes.  
When the nodes constituting the cluster are started (startnode), the node status changes to “Start”. When the cluster is started after starting the nodes (startcluster), each node status changes to “Join”, and the cluster status also changes to “In Operation”.

![Status example](img/statusSample.png)

Status example

  
A detailed explanation of the node status and cluster status is given below.  

*   Node status

Node status changes to “Stop”, “Start” or “Join” depending on whether a node is being started, stopped, joined or detached.  
If a node has joined a cluster, there are 2 types of node status depending on the status of the joined cluster.

![Node status](img/nodeStatus.png)

Node status

  

Status

Status name

Description

Join

SERVICING

Node is joined to the cluster, and the status of the joined cluster is “In Operation”

WAIT

Node is joined to the cluster, and the status of the joined cluster is “Halted”

Start

STARTED

Node is started but has not joined a cluster

STARTING

Starting node

Stop

STOP

Stop node

STOPPING

Stopping node

　

*   Cluster status
    
    GridDB cluster status changes to “Stop”, “Halted” or “In Operation” depending on the operation start/stop status of the GridDB cluster or the join/leave operation of the GridDB node. Data operations from the client can be accepted only when the GridDB cluster status is “In Operation”.
    
    ![Cluster status](img/clusterStatus.png)
    
    Cluster status
    
      
    
    Status
    
    Status name
    
    Description
    
    Operation
    
    SERVICE_STABLE
    
    All nodes defined in the cluster configuration have joined the cluster
    
    SERVICE_UNSTABLE
    
    More than half the nodes defined in the cluster configuration have joined the cluster
    
    Halted
    
    WAIT
    
    More than half the nodes defined in the cluster configuration have left the cluster
    
    INIT_WAIT
    
    1 or more of the nodes defined in the cluster configuration have left the cluster (when the cluster is operated for the first time, the status will not change to “In Operation” unless all nodes have joined the cluster)
    
    Stop
    
    STOP
    
    All nodes defined in the cluster configuration have left the cluster
    
    The GridDB cluster status will change from “Stop” to “In Operation” when all nodes constituting the GridDB cluster are allowed to join the cluster. In addition, the GridDB cluster status will change to “Halted” when more than half the nodes have left the cluster, and “Stop” when all the nodes have left the cluster.
    
    Join and leave operations (which affect the cluster status) can be applied in batch to all the nodes in the cluster, or to individual node.
    
      
    
    When all nodes are subject to the operation
    
    When the operating target is a single node
    
    Operation
    
    Join
    
    [startcluster](#*GridDBクラスタへノード一括参加) Batch entry of a group of nodes that are already operating but have not joined the cluster yet.
    
    [joincluster](#*GridDBクラスタへノード参加) Entry by a node that is in operation but has not joined the cluster yet.
    
    Left
    
    [stopcluster](#*GridDBクラスタからノード一括離脱) Batch detachment of a group of nodes attached to a cluster.
    
    [leavecluster](#*GridDBクラスタからノード離脱) Detachment of a node attached to a cluster.
    

**\[Memo\]**

*   Join and leave cluster operations can be carried out on nodes that are in operation only.
*   A node which has failed will be detached automatically from the GridDB cluster.
*   The GridDB cluster status can be checked with the cluster status data display subcommand ([configcluster](#sec-4.4.9)).

Details of the various operating methods are explained below.　

### Starting a node

Explanation on how to start a node is shown below.

*   Sub-command
    
      
    
    startnode
    
    node variable｜cluster variable \[timeout time in sec\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable｜cluster variable
    
    Specify the node to start by its node variable or cluster variable.
    
    If the cluster variable is specified, all nodes defined in the cluster variable will be started.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // start node
    gs> startnode $node1
    Node  Start node 1.
    All nodes have been started.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   The cluster start process (startcluster subcommand) can be executed in batches by waiting for the start process to complete.

### Stopping a node

Explanation on how to stop a node is shown below.

*   Sub-command
    
      
    
    stopnode
    
    Node｜cluster variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    node｜cluster variable
    
    Specify the node to stop by its node variable or cluster variable.
    
    If the cluster variable is specified, all nodes defined in the cluster variable will be stopped.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // stop node
    gs> stopnode $node1
    Node Stop Node 1.
    Node 1 has started the stop process.
    Waiting for the node stop process to end.
    All nodes have been stopped.
    

In addition, a specified node can be forced to stop as well.

*   Sub-command
    
      
    
    stopnodeforce
    
    Node｜cluster variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    node｜cluster variable
    
    Specify the node to stop by force by its node variable or cluster variable.
    
    If the cluster variable is specified, all nodes defined in the cluster variable will be stopped by force.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // stop node by force
    gs> stopnodeforce $node1
    Node Stop Node 1.
    Node 1 has started the stop process.
    Waiting for the node stop process to end.
    All nodes have been stopped.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   In a stopnode sub-command, nodes which have joined the GridDB cluster cannot be stopped. In a stopnodeforce command, nodes which have joined the GridDB cluster can also be stopped but data may be lost.

### Batch entry of nodes in a cluster

Explanation on how to add batch nodes into a cluster is shown below. In this case when a group of unattached but operating nodes are added to the cluster, the cluster status will change to In Operation.

*   Sub-command
    
      
    
    startcluster
    
    Cluster variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster by its cluster variable.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // start GridDB cluster
    gs> startcluster $cluster1
    Waiting for cluster to start.
    Cluster has started.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   To change the status of a GridDB cluster from “Stop” to “In Operation”, all nodes must be allowed to join the cluster. Check beforehand that all nodes constituting the GridDB cluster are in operation.

### Batch detachment of nodes from a cluster

Explanation on how to perform batch detachment of nodes in the cluster is shown below. To stop a GridDB cluster, simply make the attached nodes leave the cluster using the stopluster command.

*   Sub-command
    
      
    
    stopcluster
    
    Cluster variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster by its cluster variable.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // stop GridDB cluster
    gs> stopcluster $cluster1
    Waiting for a cluster to stop.
    Cluster has stopped.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.

### Node entry in a cluster

Explanation on how to attach a node into a cluster is shown below. Use the joincluster command to attach the node.

*   Sub-command
    
      
    
    joincluster
    
    Cluster variable node variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster by its cluster variable.
    
    Node variable
    
    Specify the node to join with the node variable.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // start node
    gs> startnode $node2
    Node  Start node 2.
    All nodes have been started.
    // join node
    joincluster $cluster1 $node2
    Waiting for a node to be joined to a cluster.
    Node has joined the cluster.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   Only nodes that are in operation can join a GridDB cluster. Check that the nodes joining a cluster are in operation.
*   Use the appendcluster sub-command when adding a node that is not yet defined in the cluster’s configuration to the cluster (the node is not part of the cluster).

### Detaching a node from a cluster

Explanation on how to remove a node from a cluster is shown below. Use the leavecluster or leavecluster force command to detach the node.

*   Sub-command
    
      
    
    leavecluster
    
    Node variable \[Timeout time in sec.\]
    
    leaveclusterforce
    
    Node variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable
    
    Specify the node to detach with the node variable.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // leave node
    gs> leavecluster $node2
    Waiting for node to separate from cluster
    Node has separated from cluster.
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   A node can safely leave a GridDB cluster only when the data has been duplicated in other nodes. However, a leavecluster subcommand forces a node to leave regardless of whether the data has been duplicated or not and so there is always a risk of data loss. Use the gs_leavecluster command to detach a node. See the section on “System Design & Construction - Designing Tuning Parameters” in the “GridDB Quick Start Guide” ([GridDB_QuickStartGuide.html](/en/docs/manuals/v3.1/GridDB_QuickStartGuide.html)) for details regarding data duplication.
*   A leaveclusterforce command forces a node to leave a cluster even if there is a risk that data may be lost due to the detachment.

### Adding a note to a cluster

Explanation on how to append a node to a pre-defined cluster is shown below. Use the appendcluster command to add the node.

*   Sub-command
    
      
    
    appendcluster
    
    Cluster variable node variable \[Timeout time in sec.\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster by its cluster variable.
    
    Node variable
    
    Specify the node to join with the node variable.
    
    Timeout time in sec.
    
    Specify the wait time after node start-up is completed.
    
    Immediate recovery if -1 is specified. Wait with no time limit if nothing is specified, or 0 is specified.
    
*   Example:
    
    // define node
    gs> setnode node5 192.168.0.5 10044
    // start node
    gs> startnode $node5
    // increase no. of nodes
    gs> appendcluster $cluster1 $node5
    Waiting for a node to be added to a cluster.
    A node has been added to the cluster.
    Add node variables$ node5 to cluster variable $cluster1. (Execute a save command when saving changes to a variable. )
    
    Cluster\[name=name1,239.0.5.111:33333,nodes=($node1,$node2,$node3,$node4,$node5)\]
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   To increase the number of new nodes, all nodes that constitute a GridDB cluster needs to join the cluster. If there is any node detached from the GridDB cluster, re-attach the nodes first. In addition, check that the new node to be added is in operation.
*   When executing an appendcluster subcommand, the node variable to be added is added to the cluster variable automatically. There is no need to manually change the cluster variable definition.
*   If a variable is changed, execute a save command to save the data. Unsaved contents will be discarded.
*   See the chapter on “System Design & Construction” in the “GridDB Quick Start Guide” ([GridDB_QuickStartGuide.html](/en/docs/manuals/v3.1/GridDB_QuickStartGuide.html)) for details on how to set up a new node.

### Displaying cluster status data

The following command displays the status of a GridDB cluster and each node constituting the cluster.

*   Sub-command
    
      
    
    configcluster
    
    Cluster variable
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster by its cluster variable.
    
*   Example:
    
    // display cluster data
    gs> configcluster $cluster1
    Name                  : cluster1
    ClusterName           : defaultCluster
    Designated Node Count : 4
    Active Node Count     : 4
    ClusterStatus         : SERVICE_STABLE
    
    Nodes:
      Name    Role Host:Port              Status
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
      node1     F  10.45.237.151:10040    SERVICING 
      node2     F  10.45.237.152:10040    SERVICING 
      node3     M  10.45.237.153:10040    SERVICING 
      node4     F  10.45.237.154:10040    SERVICING
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   ClusterStatus will be one of the following.
    *   INIT_WAIT: Waiting for cluster to be composed
    *   SERVICE_STABLE: In operation
    *   SERVICE_UNSTABLE: Halted (specified number of nodes constituting a cluster has not been reached)
*   Role will be one of the following.
    *   M: MASTER (master)
    *   F: FOLLOWER (follower)
    *   S: SUB_CLUSTER (temporary status in a potential master candidate)
    *   -: Not in operation

### Display of configuration data

The following command displays the GridDB cluster configuration data.

*   Sub-command
    
      
    
    config
    
    Node variable
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable
    
    Specify the node belonging to a GridDB cluster to be displayed with a node variable.
    
*   Example:
    
    // display cluster configuration data
    gs> config $node1
    {
      "follower" : \[ {
        "address" : "10.45.237.151",
        "port" : 10040
      }, {
        "address" : "10.45.237.152",
        "port" : 10040
      }, {
        "address" : "10.45.237.153",
        "port" : 10040
      }, {
        "address" : "10.45.237.154",
        "port" : 10040
      } \],
      "master" : {
        "address" : "10.45.237.155",
        "port" : 10040
      },
      "multicast" : {
        "address" : "239.0.5.111",
        "port" : 33333
      },
      "self" : {
        "address" : "10.45.237.150",
        "port" : 10040,
        "status" : "ACTIVE"
      }
    }
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   The output contents differ depending on the version of the GridDB node. Check with the support desk for details.

### Status display

The following command displays the status of the specified node and the statistical data.

*   Sub-command
    
      
    
    stat
    
    Node variable
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable
    
    Specify the node to display by its node variable.
    
*   Example:
    
    // display node status, statistical data
    gs> stat $node1
    {
      "checkpoint" : {
        "archiveLog" : 0,
        "backupOperation" : 0,
        "duplicateLog" : 0,
        "endTime" : 1413852025843,
        "mode" : "NORMAL_CHECKPOINT",
                 :
                 :
    }
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Append "$" in front of the variable name when using a variable.
*   The output contents differ depending on the version of the GridDB node.

### Log display

The following command displays the log of the specified node.

*   Sub-command
    
      
    
    logs
    
    Node variable
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable
    
    Specify the node to display by its node variable.
    
*   Example:
    
    // display log of node
    gs> logs $node0
    2013-02-26T13:45:58.613+0900 c63x64n1 4051 INFO SYSTEM\_SERVICE ../server/system\_service.cpp void SystemService::joinCluster(const char8\_t*, uint32\_t) line=179 : joinCluster requested (clusterName="defaultCluster", minNodeNum=1) 
    2013-02-26T13:45:58.616+0900 c63x64n1 4050 INFO SYSTEM\_SERVICE ../server/system\_service.cpp virtual void SystemService::JoinClusterHandler::callback(EventEngine&, util::StackAllocator&, Event*, NodeDescriptor) line=813 : ShutdownClusterHandler called g
    2013-02-26T13:45:58.617+0900 c63x64n1 4050 INFO SYSTEM\_SERVICE ../server/system\_service.cpp void SystemService::completeClusterJoin() line=639 : completeClusterJoin requested 
    2013-02-26T13:45:58.617+0900 c63x64n1 4050 INFO SYSTEM\_SERVICE ../server/system\_service.cpp virtual void SystemService::CompleteClusterJoinHandler::callback(EventEngine&, util::StackAllocator&, Event*, NodeDescriptor) line=929 : CompleteClusterJoinHandler called
    

In addition, the log output level can be displayed and changed.

  

logconf

Node variable \[category name \[log level\]\]

*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Node variable
    
    Specify the node to operate by its node variable.
    
    Category name
    
    Specify the log category name subject to the operation. Output level of all log categories will be displayed by default.
    
    Log level
    
    Specify the log level to change the log level of the specified category.
    
    Log level of the specified category will be displayed by default.
    
*   Example:
    
    // display log level of node
    gs> logconf $node0
    {
      "CHECKPOINT_SERVICE" : "INFO",
      "CHUNK_MANAGER" : "ERROR",
      "CLUSTER_OPERATION" : "INFO",
      "CLUSTER_SERVICE" : "ERROR",
      "COLLECTION" : "ERROR",
      "DATA_STORE" : "ERROR",
      "EVENT_ENGINE" : "WARNING",
      "HASH_MAP" : "ERROR",
      "IO_MONITOR" : "WARNING",
      "LOG_MANAGER" : "WARNING",
      "MAIN" : "ERROR",
      "OBJECT_MANAGER" : "INFO",
      "RECOVERY_MANAGER" : "INFO",
      "REPLICATION" : "WARNING",
      "REPLICATION_TIMEOUT" : "WARNING",
      "SESSION_TIMEOUT" : "WARNING",
      "SYNC_SERVICE" : "ERROR",
      "SYSTEM_SERVICE" : "INFO",
      "TIME_SERIES" : "ERROR",
      "TRANSACTION_MANAGER" : "ERROR",
      "TRANSACTION_SERVICE" : "ERROR",
      "TRANSACTION_TIMEOUT" : "WARNING",
      "TRIGGER_SERVICE" : "ERROR"
    }
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Log levels are ERROR, WARNING, INFO, and DEBUG. Be sure to follow the instructions of the support desk when changing the log level.
*   Log level is initialized by restarting the node. Changes to the log level are not saved.
*   Batch changes cannot be made to the log level of multiple categories.
*   The output contents differ depending on the version of the GridDB node. Check with the support desk for details.

### Data Operation in a Database

To execute a data operation, there is a need to connect to the cluster subject to the operation.  
Data in the database configured during the connection (“public” when the database name is omitted) will be subject to the operation.

### Connecting to a Cluster

The following command establishes connection to a GridDB cluster to execute a data operation.

*   Sub-command
    
      
    
    connect
    
    Cluster variable \[database name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Cluster variable
    
    Specify a GridDB cluster serving as the connection destination by its cluster variable.
    
    Database name
    
    Specify the database name.
    
*   Example:
    
    // connect to GridDB cluster
    // for NoSQL
    gs> connect $cluster1
    Connection successful (NoSQL).
    gs\[public\]> 
    
    gs> connect $cluster1 userDB
    Connection successful (NoSQL).
    gs\[userDB\]> 
    
    // for NewSQL (configure both NoSQL/NewSQL interfaces)
    gs> connect $cluster1
    Connection successful (NoSQL).
    Connection successful (NewSQL).
    gs\[public\]> 
    

**\[Memo\]**

*   Connect to the database when the database name is specified. Connect to the “public” database if the database name is omitted.
*   If the connection is successful, the connection destination database name appears in the prompt.
*   Append "$" in front of the variable name when using a variable.
*   When executing a data operation subcommand, it is necessary to connect to a GridDB cluster.
*   If the SQL connection destination is specified (execution of setclustersql sub-command), SQL connection is also carried out.

### Search (TQL)

The following command will execute a search and retain the search results.

*   Sub-command
    
      
    
    tql
    
    Container name query;
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the container subject to the search.
    
    Query;
    
    Specify the TQL command to execute. A semicolon (;) is required at the end of a TQL command.
    
*   Example:
    
    // execute search
    gs\[public\]> tql c001 select *;
    5 hits located.
    

**\[Memo\]**

*   When executing a data operation subcommand, it is necessary to connect to a GridDB cluster.
*   A return can be inserted in the middle of a TQL command.
*   Retain the latest search result. Search results are discarded when a tql or sql subcommand is executed.
*   See the chapter on “TQL Syntax & Operating Functions” in the “GridDB API Reference” ([GridDB\_API\_Reference.html](/en/docs/manuals/v3.1/GridDB_API_Reference.html)) for the TQL details.

### SQL Command Execution

The following command executes an SQL command and retains the search result. This function can be executed in the GridDB Advanced Edition only.

*   Sub-command
    
      
    
    sql
    
    SQL command;
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    SQL command;
    
    Specify the SQL command to execute. A semicolon (;) is required at the end of the SQL command.
    
*   Example:
    
    gs\[public\]> sql select * from con1; → search for SQL
    10,000 hits located.
    gs\[public\]> get 1 → display SQL results
    id,name
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    0,tanaka
    

**\[Memo\]**

*   Can be executed in the GridDB Advanced Edition only.
*   Before executing a sql command, there is a need to specify the SQL connection destination and perform a connection first.
*   Retain the latest search result. Search results are discarded when a sql or tql sub-command is executed.
*   The following results will appear depending on the type of SQL command.
    
      
    
    Process
    
    Execution results when terminated normally
    
    Search SELECT
    
    Display the no. of search results found. Search results are displayed in sub-command get/getcsv/getnoprint.
    
    Update INSERT/UPDATE/DELETE
    
    Display the no. of rows updated.
    
    DDL text
    
    Nothing is displayed.
    
*   See “GridDB API Reference” ([GridDB\_API\_Reference.html](/en/docs/manuals/v3.1/GridDB_API_Reference.html)) for the SQL details.

### Getting Search Results

The following command gets the inquiry results and presents them in different formats. There are 3 ways to output the results as listed below.

(A) Display the results obtained in a standard output.

*   Sub-command
    
      
    
    get
    
    \[No. of cases acquired\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    No. of cases acquired
    
    Specify the number of search results to be acquired. All search results will be obtained and displayed by default.
    

(B) Save the results obtained in a file in the CSV format.

*   Sub-command
    
      
    
    getcsv
    
    CSV file name \[No. of search results found\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    File name
    
    Specify the name of the file where the search results are saved.
    
    No. of cases acquired
    
    Specify the number of search results to be acquired. All search results will be obtained and saved in the file by default.
    

Results obtained in (C) will not be output.

*   Sub-command
    
      
    
    getnoprint
    
    \[No. of cases acquired\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    No. of cases acquired
    
    Specify the number of search results to be acquired. All search results will be obtained by default.
    
*   Example:
    
    // execute search
    gs\[public\]> tql c001 select *;
    5 hits located.
    
    //Get first result and display
    gs\[public\]> get 1
    name,status,count
    mie,true,2
    Acquisition of one result completed.
    
    //Get second and third results and save them in a file
    gs\[public\]> getcsv /var/lib/gridstore/test2.csv 2
    Acquisition of 2 results completed.
    
    //Get fourth result
    gs\[public\]> getnoprint 1
    Acquisition of one result completed.
    
    //Get fifth result and display
    gs\[public\]> get 1
    name,status,count
    akita,true,45
    Acquisition of one result completed.
    

**\[Memo\]**

*   When executing a data operation subcommand, it is necessary to connect to a GridDB cluster.
*   Output the column name to the first row of the search results
*   An error will occur if the search results are obtained when a search has not been conducted, or after all search results have been obtained or discarded.

### Getting the Execution Plan

The following command displays the execution plan of the specified TQL command. Search is not executed.

*   Sub-command
    
      
    
    tqlexplain
    
    Container name query;
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the target container.
    
    Query;
    
    Specify the TQL command to get the execution plan. A semicolon (;) is required at the end of a TQL command.
    
*   Example:
    
    //Get execution plan
    gs\[public\]> tqlexplain c001 select * ;
    0       0       SELECTION       CONDITION       NULL
    1       1       INDEX   BTREE   ROWMAP
    2       0       QUERY\_EXECUTE\_RESULT_ROWS       INTEGER 0
    

In addition, the actual measurement values such as the number of processing rows etc. can also be displayed together with the executive plan by actually executing the specified TQL command.

*   Sub-command
    
      
    
    tqlanalyze
    
    Container name query;
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the target container.
    
    Query;
    
    Specify the TQL command to get the execution plan. A semicolon (;) is required at the end of a TQL command.
    
*   Example:
    
    // Execute search to get execution plan
    gs\[public\]> tqlanalyze c001 select *;
    0       0       SELECTION       CONDITION       NULL
    1       1       INDEX   BTREE   ROWMAP
    2       0       QUERY\_EXECUTE\_RESULT_ROWS       INTEGER 5
    3       0       QUERY\_RESULT\_TYPE       STRING  RESULT\_ROW\_ID_SET
    4       0       QUERY\_RESULT\_ROWS       INTEGER 5
    

**\[Memo\]**

*   When executing a data operation sub-command, it is necessary to connect to a GridDB cluster.
*   See the chapter on “TQL Syntax & Operating Functions” in the “GridDB API Reference” ([GridDB\_API\_Reference.html](/en/docs/manuals/v3.1/GridDB_API_Reference.html)) for the detailed execution plan.
*   Since search results are not retained, search results cannot be acquired and thus there is also no need to execute a tqlclose subcommand. When the search results are required, execute a query with the tql subcommand.

### Discarding Search Results

Close the tql and discard the search results saved.

*   Sub-command
    
      
    
    tqlclose
    

Close query. Discard the search results retained. 。

*   Sub-command
    
      
    
    queryclose
    
*   Example:
    
    //Discard search results
    gs\[public\]> tqlclose
    
    gs\[public\]> queryclose
    

**\[Memo\]**

*   Search results are discarded at the following timing.
    *   When a tqlclose or query close sub-command is executed
    *   When executing a new search using a tql or sql sub-command
    *   When disconnecting from a GridDB cluster using a disconnect sub-command
*   An error will occur if search results are acquired (get sub-command, etc.) after they have been discarded.

### Disconnecting from a Cluster

The following command disconnect user from a GridDB cluster.

*   Sub-command
    
      
    
    disconnect
    
*   Example:
    
    //Disconnect from a GridDB cluster
    gs\[public\]> disconnect
    gs> 
    

**\[Memo\]**

*   Retained search results are discarded.
*   When disconnected, the connection database name will disappear from the prompt.

### Database Management

This section explains the available sub-commands that can be used for database management. Connect to the cluster first prior to performing database management (sub-command connect).

### Creating a Database

The following command is used to create a database.

*   Sub-command
    
      
    
    createdatabase
    
    Database name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Database name
    
    Specify the name of the database to be created.
    
*   Example:
    
    //Create a database with the name “db1”
    gs\[public\]> createdatabase db1
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   Only the administrator user can access a database immediately after it has been created. Assign access rights to general users where necessary.

### Deleting a Database

The following command is used to delete a database.

*   Sub-command
    
      
    
    dropdatabase
    
    Database name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Database name
    
    Specify the name of the database to be deleted.
    
*   Example:
    
    //Delete databases like those shown below
    //db1: No container exists in the database
    //db2: Database does not exist
    //db3: Container exists in the database
    
    gs\[public\]> dropdatabase db1　　　　　　　　　// normal termination
    gs\[public\]> dropdatabase db2　　　　　　　　　// abnormal termination
    D20340: Database "db2" does not exist.
    gs\[public\]> dropdatabase db3　　　　　　　　　// abnormal termination
    D20336: Error occurred in deleting the database : msg=\[\[145045:JC\_DATABASE\_NOT_EMPTY\] Illegal target error by non-empty database.\]
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   A public database which is a default connection destination cannot be deleted.

### Current DB Display

The following command is used to display the current database name.

*   Sub-command
    
      
    
    getcurrentdatabase
    
    　
    
*   Example:
    
    gs\[db1\]> getcurrentdatabase
    db1
    

### Database List

The following command is used to display the database list and access rights data.

*   Sub-command
    
      
    
    showdatabase
    
    \[Database name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Database name
    
    Specify the name of the database to be displayed.
    
*   Example:
    
    gs\[public\]> showdatabase
    database     ACL
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    public       ALL_USER
    db1          user1
    db2          user1
    db3          user3
    
    gs\[public\]> showdatabase db1
    database     ACL
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    public       ALL_USER
    db1          user1
    

**\[Memo\]**

*   For general users, only databases for which access rights have been assigned will be displayed. For administrator users, a list of all the databases will be displayed.

### Assignment of Access Rights

The following command is used to assign access rights to the database.

*   Sub-command
    
      
    
    grant
    
    Database name user name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Database name
    
    Specify the name of the database for which access rights are going to be assigned
    
    User name
    
    Specify the name of the user to assign access rights to.
    
*   Example:
    
    gs\[public\]> grant db1 user001
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   An error will occur if access rights have already been assigned (only 1 user can be assigned access rights to each database). Execute this command after revoking the access rights ("revoke" command).

### Revoking of Access Rights

The following command is used to revoke access rights to the database.

*   Sub-command
    
      
    
    revoke
    
    Database name user name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Database name
    
    Specify the name of the database for which access rights are going to be revoked.
    
    User name
    
    Specify the name of the user whose access rights are going to be revoked.
    
*   Example:
    
    gs\[public\]> revoke db1 user001
    

**\[Memo\]**

*   Command can be executed by an administrator user only.

### User Management

This section explains the available sub-commands that can be used to perform user management. Connect to the cluster first prior to performing user management (sub-command connect).

### Creating a General User

The following command is used to create a general user (username and password).

*   Sub-command
    
      
    
    createuser
    
    User name password
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    User name
    
    Specify the name of the user to be created.
    
    Password
    
    Specify the password of the user to be created.
    
*   Example:
    
    gs\[public\]> createuser user01 pass001
    

**\[Memo\]**

*   Command can be executed by an administrator user only.
*   A name starting with "gs#" cannot be specified as the name of a general user as it is reserved for use by the administrator user.
*   When creating an administrator user, use the gs_adduser command in all the nodes constituting the cluster.

### Deleting a General User

The following command is used to delete a user.

*   Sub-command
    
      
    
    dropuser
    
    User name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    User name
    
    Specify the name of the user to be deleted.
    
*   Example:
    
    gs\[public\]> dropuer user01
    

**\[Memo\]**

*   Command can be executed by an administrator user only.

### Update Password

The following command is used to update the user password.

*   Sub-command
    
      
    
    setpassword
    
    　Password (general user only)
    
    setpassword
    
    　User name password (administrator user only)
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Password
    
    Specify the password to change.
    
    User name
    
    Specify the name of the user whose password is going to be changed.
    

**\[Memo\]**

*   The general user can change its own password only.
*   An administrator user can change the passwords of other general users only.
    
    *   Example:
    
    gs\[public\]> setpassword newPass009
    

### General User List

The following command displays the user data.

*   Sub-command
    
      
    
    showuser
    
    \[User name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    User name
    
    Specify the name of the user to be displayed.
    
*   Example:
    
    gs\[public\]> showuser
    UserName
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    user002
    user001
    user003
    
    gs\[public\]> showuser user001
    Name     : user001
    GrantedDB: public, userDB
    

**\[Memo\]**

*   Command can be executed by an administrator user only.

### Container Management

This section explains the available sub-commands that can be used when performing container operations. Connect to the cluster first before performing container management. Containers in the database at the (sub-command connect) connection destination will be subject to the operation.

### Container Creation

Create a container.

*   Sub-command
    *   Simplified version
        
          
        
        Container (collection)
        
        　createcollection
        
        Container name Column name Type \[Column name Type …\]
        
        Container (time series container)
        
        　createtimeseries
        
        Container name Compression method Column name type \[Column name Type …\]
        
    *   Detailed version
        
          
        
        　createcontainer
        
        Container data file \[Container name\]
        
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the name of the container to be created. If the name is omitted in the createcontainer command, a container with the name given in the container data file will be created.
    
    Column name
    
    Specify the column name.
    
    Type
    
    Specify the column type.
    
    Compression method
    
    For time series data, specify the data compression method.
    
    Container definition file
    
    Specify the file storing the container data in JSON format.
    
    **Simplified version**
    
    Specify the container name and column data (column name and type) to create the container. The compression type can also be specified for time series containers only.
    
    *   Specify "NO", "SS" for the compression method. Use the detailed version if "HI" is specified.
    *   The collection will be created with a specified row key. The first column will become the row key.
    
    **Detailed version**
    
    Specify the container definition data in the json file to create a container.
    
    *   The container definition data has the same definition as the metadata file output by the export tool. See [Metadata files](#impexp_metadata) with [the container data file format](#container_dataform) for the column type and data compression method, container definition format, etc. However, the following data will be invalid in this command even though it is defined in the metadata file of the export command.
        *   version Export tool version
        *   database Database name
        *   containerFileType Export data file type
        *   containerFile Export file name
        *   partitionNo Partition no.
    *   Describe a single container definition in a single container definition file.
    *   If the container name is omitted in the argument, create the container with the name described in the container definition file.
    *   If the container name is omitted in the argument, ignore the container name in the container definition file and create the container with the name described in the argument.
    *   An error will not result even if the database name is described in the container definition file but the name will be ignored and the container will be created in the database currently being connected.
    *   When using the container definition file, [the metadata file will be output when the --out option is specified in the export function](#impexp_export). The output metadata file can be edited and used as a container definition file.

　　Example: When using the output metadata file as a container definition file

{
    "version":"2.1.00",　　　　　　　　　　　　　　　←invalid
    "container":"container_354",
    "database":"db2",　　　　　　　　　　　　　　　　←invalid
    "containerType":"TIME_SERIES",
    "containerFileType":"binary",　　　　　　　　　　←invalid
    "containerFile":"20141219\_114232\_098_div1.mc", 　←invalid
    "rowKeyAssigned":true,
    "partitionNo":0,　　　　　　　　　　　　　　　　 ←invalid
    "columnSet":\[
        {
            "columnName":"timestamp",
            "type":"timestamp"
        },
        {
            "columnName":"active",
            "type":"boolean"
        },
        {
            "columnName":"voltage",
            "type":"double"
        }
    \],
    "timeSeriesProperties":{
        "compressionMethod":"NO",
        "compressionWindowSize":-1,
        "compressionWindowSizeUnit":"null",
        "expirationDivisionCount":8,
        "rowExpirationElapsedTime":-1,
        "rowExpirationTimeUnit":"null"
    },
    "compressionInfoSet":\[
    \]

### Container Deletion

The following command is used to delete a container.

*   Sub-command
    
      
    
    dropcontainer
    
    Container name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the name of the container to be deleted.
    
*   Example:
    
    gs\[public\]> dropcontainer　Con001
    

### Container Indication

The following command is used to display the container data.

*   Sub-command
    
      
    
    showcontainer
    
    Container name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the container name to be displayed. Display a list of all containers if omitted.
    
*   Example:
    
    // display container list
    gs\[userDB\]> showcontainer
    Database : userDB
    Name                  Type         PartitionId
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    cont001               COLLECTION            10
    col00a                COLLECTION             3
    time02                TIME_SERIES            5
    cont003               COLLECTION            15
    cont005               TIME_SERIES           17
    
    // display data of specified container
    gs\[public\]> showcontainer cont003
    Database    : userDB
    Name : cont003
    Type : COLLECTION
    Partition ID: 15
    DataAffinity: -
    
    Columns:
    No  Name                  Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1                  INTEGER         \[TREE\] (RowKey)
     1  col2                  STRING          \[\]
     2  col3                  TIMESTAMP       \[\]
    

**\[Memo\]**

*   The data displayed in a container list are the “Container name”, “Container type” and “Partition ID”.
*   The data displayed in the specified container are the “Container name”, “Container type”, “Partition ID”, “Defined column name”, “Column data type” and “Column index setting”.
*   Container data of the current DB will be displayed.

### Displaying a Table

The following command is used to display the table data. This function can be used in the GridDB Advanced Edition only.

*   Sub-command
    
      
    
    showtable
    
    Table name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Table name
    
    Specify the table name to be displayed. Display a list of all tables if omitted.
    
*   Example:
    
    // display table list
    gs\[userdb\]> showtable
    Database : userdb
    Name           PartitionId
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    table09                  3
    table02                  7
    table03                 12
    
     Total Count: 3
    
    //Display the specified table data
    gs\[userdb\]> showtable table09
    Database    : userdb
    Name        : table09
    Partition ID: 3
    
    Columns:
    No  Name            Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1            INTEGER         \[TREE\]
     1  col2            STRING          \[\]
     2  col3            STRING          \[\]
     
    

**\[Memo\]**

*   The data displayed in a table list are the “Table name“ and “Partition ID”.
*   The data displayed in the specified table are the “Table name“, “Partition ID”, “Defined column name“, “Column data type“ and “Column index setting”.
*   Table data of the current DB will be displayed.

### Creation of Index

The following command is used to create an index in the column of a specified container.

*   Sub-command
    
      
    
    createindex
    
    Container name Column name Index type...
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the name of container that the column subject to the index operation belongs to.
    
    Column name
    
    Specify the name of the column subject to the index operation.
    
    Index type...
    
    Specify the index type. Specify TREE, HASH or SPATIAL (or multiple) for the index type
    
*   Example:
    
    // create index
    gs\[public\]> createindex cont003 col2 tree hash
    
    gs\[public\]> showcontainer cont003
    Database    : public
    Name : cont003
    Type : COLLECTION
    Partition ID: 15
    DataAffinity: -
    
    Columns:
    No  Name                  Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1                  INTEGER         \[TREE\] (RowKey)
     1  col2                  STRING          \[TREE, HASH\]
     2  col3                  TIMESTAMP       \[\]
    

**\[Memo\]**

*   An error will not occur even if an index that has already been created is specified.

### Deletion of Index

The following command is used to delete the index in the column of a specified container.

*   Sub-command
    
      
    
    dropindex
    
    Container name Column name Index type...
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container name
    
    Specify the name of container that the column subject to the index operation belongs to.
    
    Column name
    
    Specify the name of the column subject to the index operation.
    
    Index type...
    
    Specify the index type. Specify TREE, HASH or SPATIAL (or multiple) for the index type
    
*   Example:
    
    //deletion of index
    gs\[public\]> showcontainer cont003
    Database    : public
    Name : cont003
    Type : COLLECTION
    Partition ID: 15
    DataAffinity: -
    
    Columns:
    No  Name                  Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1                  INTEGER         \[TREE\] (RowKey)
     1  col2                  STRING          \[TREE, HASH\]
     2  col3                  TIMESTAMP       \[HASH\]
    
    gs\[public\]> dropindex cont003 col2 hash
    
    gs\[public\]> showcontainer cont003
    Database    : public
    Name : cont003
    Type : COLLECTION
    Partition ID: 15
    DataAffinity: -
    
    Columns:
    No  Name                  Type            Index
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
     0  col1                  INTEGER         \[TREE\] (RowKey)
     1  col2                  STRING          \[TREE\]
     2  col3                  TIMESTAMP       \[HASH\]
    

**\[Memo\]**

*   An error will not occur even if an index that has not been created is specified.

### Deletion of Trigger

The following command is used to delete the trigger of a specified container.

*   Sub-command
    
      
    
    droptrigger
    
    Container name Trigger name
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container
    
    Specify the name of the container whose trigger is going to be deleted.
    
    Trigger name
    
    Specify the trigger name to delete.
    
*   Example:
    
    gs\[public\]> droptrigger con01 tri03
    

### Display of Trigger

The following command is used to display the trigger data of a specified container.

*   Sub-command
    
      
    
    showtrigger
    
    Container name \[trigger name\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Container
    
    Specify the container name to be displayed.
    
    Trigger name
    
    Specify the trigger name to be displayed. Display a list of all trigger data if omitted.
    
*   Example:
    
    //Display the trigger data list of the specified container
    gs\[public\]> showtrigger cont003
    Name                 Type  Columns              Events
    \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
    rtrig01              REST  \[col1, col3\]         \[PUT\]
    
    gs\[public\]> showtrigger cont003 rtrig01
    Name : rtrig01
    Type          : REST
    Target Columns: \[col1, col3\]
    Target Events : \[PUT\]
    
    Destination URI: http://example.com
    

**\[Memo\]**

*   The data displayed in a trigger list are the “Trigger name”, “Notification method”, “Column to be notified”, “Operation to be monitored (create new or update, delete a row)”.
*   The data displayed in the specified trigger data are the “Trigger name”, “Notification method”, “Column to be notified”, “Operation to be monitored” and “Notification destination URI”. In addition, the “Destination name”, “Destination type“, “User“ and “Password” are also displayed together in a JMS notification.
*   See the chapter on “Trigger Function” in the “GridDB API Reference” ([GridDB\_API\_Reference.html](/en/docs/manuals/v3.1/GridDB_API_Reference.html)) for the trigger function details.

### Other Operations

This section explains the sub-commands for other operations.

### Echo Back Setting

The following command is used to display the executed sub-command in the standard output.

*   Sub-command
    
      
    
    echo
    
    boolean
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    boolean
    
    Display the executed subcommand in the standard output when TRUE is specified Prescribed value is FALSE.
    
*   Example:
    
    // display the executed subcommand in the standard output
    gs> echo TRUE
    

**\[Memo\]**

*   gs_sh prompt "gs>" always appear in the standard output.

### Message Display

The following command is used to display the definition details of the specified character string or variable.

*   Sub-command
    
      
    
    print
    
    Message
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Message
    
    Specify the character string or variable to display.
    
*   Example:
    
    // display of character string
    gs> print  print executed.
    Print executed.
    

**\[Memo\]**

*   Append "$" in front of the variable name when using a variable.

### Sleep

The following command can be used to set the time for the sleeping function.

*   Sub-command
    
      
    
    sleep
    
    No. of sec
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    No. of sec
    
    Specify the no. of sec to go to sleep.
    
*   Example:
    
    // sleep for 10 sec
    gs> sleep 10
    

**\[Memo\]**

*   Specify a positive integer for the no. of sec number.

### Execution of External Commands

The following command is used to execute an external command.

*   Sub-command
    
      
    
    exec
    
    External command \[External command argument\]
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    External command
    
    Specify an external command.
    
    External command argument
    
    Specify the argument of an external command.
    
*   Example:
    
    // display the file data of the current directory
    gs> exec ls -la
    

**\[Memo\]**

*   Pipe, redirect, hear document cannot be used.

### Terminating gs_sh

The following command is used to terminate gs_sh.

*   Sub-command
    
      
    
    exit
    
    quit
    
*   Example:
    
    // terminate gs_sh.
    gs> exit
    

　In addition, if an error occurs in the sub-command, the setting can be configured to end gs_sh.

*   Sub-command
    
      
    
    errexit
    
    boolean
    
*   Description of each argument
    
      
    
    Argument
    
    Description
    
    boolean
    
    If TRUE is specified, gs_sh ends when an error occurs in the sub-command. Default is FALSE.
    
*   Example:
    
    // configure the setting so as to end gs_sh when an error occurs in the sub-command
    gs> errexit TRUE
    

**\[Memo\]**

*   There is no functional difference between the exit sub-command and quit sub-command.

### Help

The following command is used to display a description of the sub-command. - subcommand

  

help

\[Sub-command name\]

*   Description of each argument
    
      
    
    Argument
    
    Description
    
    Sub-command name
    
    Specify the subcommand name to display the description Display a list of the subcommands if omitted.
    
*   Example:
    
    // display the description of the subcommand
    gs> help exit
    exit
    The following command is used to terminate gs_sh.
    

**\[Memo\]**

*   A description of gs\_sh can be obtained with the command “gh\_sh --help”.

### Version

The following command is used to display the version of gs_sh.

*   Sub-command
    
      
    
    version
    
*   Example:
    
    // display of version
    gs> version
    gs_sh version 2.0.0
    

**\[Memo\]**

*   The gs\_sh version data can be obtained with the command “gh\_sh --version” as well.

### Options and Subcommand Specifications

### Options

*   Command list
    
      
    
    gs_sh
    
    \[Script file\]
    
    gs_sh
    
    -v｜--version
    
    gs_sh
    
    -h｜--help
    
*   Optional specifications
    
      
    
    Optional
    
    Essential
    
    Description
    
    -v｜--version
    
    Display the version of the tool.
    
    -h｜--help
    
    Display the command list as a help message.
    

**\[Memo\]**

*   In order to batch process the gs_sh sub-command, a script file can be created. Extension of the script file is gsh.
*   During gs_sh startup, .gsshrc script files under the gsadm user home directory are imported automatically. The .gsshrc contents will also be imported to the destination from other script files.

### Sub-command List

*   GridDB cluster definition sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　setnode
    
    Node variables name IP address
    
    Define the node variable.
    
    　　Port no. \[SSH port no.\]
    
    　　setcluster
    
    Cluster variable name cluster name　
    
    Define the cluster variable.
    
    　　Multicast address port no.
    
    　　\[Node variable... \]
    
    　　setclustersql
    
    Cluster variable name cluster name
    
    Define the SQL connection destination in the cluster configuration.
    
    　　SQL address SQL port no.
    
    　　modcluster 　
    
    Cluster variable name
    
    Add or delete a node variable to or from the cluster variable.
    
    　　 add｜remove node variable...
    
    　　setuser
    
    User name password　
    
    Define the user and password to access the cluster.
    
    　　\[Password of OS user gsadm\]
    
    　　set
    
    Variable name \[value\]
    
    Define an arbitrary variable.
    
    　　show
    
    \[Variable name\]
    
    Display the detailed definition of the variable.
    
    　　save
    
    \[Script file name\]
    
    Save the variable definition in the script file.
    
    　　load
    
    \[Script file name\]
    
    Execute a read script file.
    

*   GridDB cluster operation sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　startnode
    
    Node｜cluster variable \[Timeout time in sec.\]
    
    Explanation on how to start a node is shown below.
    
    *
    
    　　stopnode
    
    Node｜cluster variable \[Timeout time in sec.\]
    
    Explanation on how to stop a node is shown below.
    
    *
    
    　　stopnodeforce
    
    Node｜cluster variable \[Timeout time in sec.\]
    
    Stop the specified node by force.
    
    *
    
    　　startcluster
    
    Cluster variable \[Timeout time in sec.\]
    
    Attach the active node groups to a cluster, together at once.
    
    *
    
    　　stopcluster
    
    Cluster variable \[Timeout time in sec.\]
    
    Detach all of the currently attached nodes from a cluster, together at once.
    
    *
    
    　　joincluster
    
    Cluster variable node variable \[Timeout time in sec.\]
    
    Attach a node individually to a cluster.
    
    *
    
    　　leavecluster
    
    Node variable \[Timeout time in sec.\]
    
    Detach a node individually from a cluster.
    
    *
    
    　　leaveclusterforce
    
    Node variable \[Timeout time in sec.\]
    
    Force the specified node to leave/get detached from a cluster.
    
    *
    
    　　appendcluster
    
    Cluster variable node variable \[Timeout time in sec.\]
    
    Add an undefined node to a pre-defined cluster.
    
    *
    
    　　configcluster
    
    Cluster variable
    
    Display the cluster status data.
    
    *
    
    　　config
    
    Node variable
    
    Display the cluster configuration data.
    
    *
    
    　　stat
    
    Node variable
    
    Display the status of the specified node.
    
    *
    
    　　logs
    
    Node variable
    
    The following command displays the log of the specified node.
    
    *
    
    　　logconf
    
    Node variable \[category name \[output level\]\]
    
    Display and change the log settings.
    
    *
    

　　　　\*1: Commands marked with an \* can be executed by an administrator user only.  

*   Data operation sub-command list in database
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　connect
    
    Cluster variable \[database name\]
    
    Connect to a GridDB cluster.
    
    　　tql
    
    Container name query;
    
    The following command will execute a search and retain the search results.
    
    　　get
    
    \[No. of cases acquired\]
    
    Get the search results and display them in a standard output.
    
    　　getcsv
    
    CSV file name \[No. of search results found\]
    
    Get the search results and save them in a file in the CSV format.
    
    　　getnoprint
    
    \[No. of cases acquired\]
    
    Get the query results but do not display them in a standard output.
    
    　　tqlclose
    
    Discard the search results retained.
    
    　　tqlanalyze
    
    Container name query;
    
    The following command displays the execution plan of the specified TQL command.
    
    　　tqlexplain
    
    Container name query;
    
    Execute the specified TQL command and display the execution plan and actual measurement values such as the number of cases processed etc.
    
    　　sql
    
    SQL command;
    
    The following command executes an SQL command and retains the search result.
    
    　　queryclose
    
    Close SQL.
    
    　　disconnect
    
    The following command disconnect user from a GridDB cluster.
    

　　　　 \*1: Commands marked with an \* can be executed by an administrator user only.  

*   Database management sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　createdatabase
    
    Database name
    
    Create a database.
    
    *
    
    　　dropdatabase
    
    Database name
    
    Delete a database.
    
    *
    
    　　getcurrentdatabase
    
    Display the current database name.
    
    　　showdatabase
    
    \[Database name\]
    
    The following command is used to display the database list and access rights data.
    
    　　grant
    
    Database name user name
    
    The following command is used to assign access rights to the database.
    
    *
    
    　　revoke
    
    Database name user name
    
    The following command is used to revoke access rights to the database.
    
    *
    

　　　　 \*1: Commands marked with an \* can be executed by an administrator user only.  

*   User management sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　createuser
    
    User name password
    
    Create a general user.
    
    *
    
    　　dropuser
    
    User name
    
    Delete a general user.
    
    *
    
    　　setpassword
    
    Password
    
    Change your own password.
    
    　　setpassword
    
    User name password
    
    Change the password of a general user.
    
    　　showuser
    
    \[User name\]
    
    The following command displays the user data.
    

　　　　 \*1: Commands marked with an \* can be executed by an administrator user only.  

*   Container management sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　createcollection
    
    Container name Column name Type \[Column name Type …\]
    
    Create a container (collection),
    
    　　createtimeseries
    
    Container name Compression method Column name type \[Column name Type …\]
    
    Create a container (time series container).
    
    　　createcontainer
    
    Container data file \[Container name\]
    
    Create a container from the container data file.
    
    　　dropcontainer
    
    Container name
    
    The following command is used to delete a container.
    
    　　showcontainer
    
    \[Container name\]
    
    The following command is used to display the container data.
    
    　　showtable
    
    \[Table name\]
    
    The following command is used to display the table data.
    
    　　createindex
    
    Container name Column name Index type...
    
    Create an index in the specified column.
    
    　　dropindex
    
    Container name Column name Index type...
    
    Delete an index of the specified column.
    
    　　droptrigger
    
    Container name Trigger name
    
    Delete the trigger data.
    
    　　showtrigger
    
    Container name \[trigger name\]
    
    Display the trigger data.
    

　　　　 \*1: Commands marked with an \* can be executed by an administrator user only.  

*   Other operation sub-command list
    
      
    
    Sub-command
    
    Argument
    
    Description
    
    *1
    
    　　echo
    
    boolean
    
    Set whether to echo back.
    
    　　print
    
    Message
    
    The following command is used to display the definition details of the specified character string or variable.
    
    　　sleep
    
    No. of sec
    
    The following command can be used to set the time for the sleeping function.
    
    　　exec
    
    External command \[External command argument\]
    
    The following command is used to execute an external command.
    
    　　exit
    
    The following command is used to terminate gs_sh.
    
    　　quit
    
    The following command is used to terminate gs_sh.
    
    　　errexit
    
    boolean
    
    Set whether to terminate gs_sh when an error occurs.
    
    　　help
    
    \[Subcommand name\]
    
    The following command is used to display a description of the sub-command.
    
    　　version
    
    Display the version data.
    

　　　　 \*1: Commands marked with an \* can be executed by an administrator user only.
