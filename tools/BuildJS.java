
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardOpenOption;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BuildJS {

  private final static List<String> toRename = List.of("Button", "CheckBox", "ComboBox", "Component", "Dialog", "Frame", "Label", "Panel", "ProgressBar", "RadioButton", "Slider", "Spinner", "TabbedPane", "TextField", "ToggleButton");

  @SuppressWarnings({"UseOfSystemOutOrSystemErr", "CallToPrintStackTrace", "MismatchedQueryAndUpdateOfCollection"})
  private static void watch(File pizzApazzAjs, File in, File out, boolean findParent, boolean rename) throws Exception {
    System.out.println("watching " + in + " into " + out);

    Map<WatchKey, Path> map = new HashMap<>();
    WatchService watchService = FileSystems.getDefault().newWatchService();
    map.put(in.toPath().register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_DELETE), in.toPath());

    Files.walkFileTree(in.toPath(), new SimpleFileVisitor<Path>() {
      @Override
      public FileVisitResult preVisitDirectory(Path path, BasicFileAttributes attrs) throws IOException {
        map.put(path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_DELETE), path);
        return FileVisitResult.CONTINUE;
      }
    });

    while (true) {
      WatchKey watchKey = watchService.take();

      watchKey.pollEvents().forEach(event -> {
        try {
          BuildJS.write(pizzApazzAjs, in, out, findParent, rename);
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      });

      watchKey.reset();
    }
  }

  @SuppressWarnings("UseOfSystemOutOrSystemErr")
  private static void write(File pizzApazzAjs, File in, File out, boolean findParent, boolean rename) throws Exception {
    @SuppressWarnings({"CallToPrintStackTrace", "BroadCatchBlock", "TooBroadCatch", "UseSpecificCatch"})
    List<TreeNode> nodes = Files.find(in.toPath(), 999, (p, bfa) -> bfa.isRegularFile() && p.getFileName().toString().matches(".*\\.js")).map(path -> {
      try {
        TreeNode node = new TreeNode();

        node.content = rename ? BuildJS.rename(Files.readString(path)) : Files.readString(path);
        int indexStart = node.content.indexOf("class ");
        int indexStop = node.content.indexOf(' ', indexStart + 6);
        node.name = node.content.substring(indexStart + 6, indexStop);

        indexStart = node.content.indexOf(" extends ");
        indexStop = node.content.indexOf(' ', indexStart + 9);

        node.parentName = indexStart != -1 ? node.content.substring(indexStart + 9, indexStop) : null;
        return node;
      } catch (Exception ex) {
        ex.printStackTrace();
        return null;
      }
    }).collect(Collectors.toList());

    nodes.forEach(node -> {
      if (node.parentName != null) {
        nodes.stream().filter(parent -> parent.name.equals(node.parentName)).findFirst().ifPresentOrElse(parent -> parent.children.add(node), () -> {
          if (findParent) {
            System.err.println(" parent class not found name = " + node.name + ", parentName = " + node.parentName);
          } else {
            node.parentName = null;
          }
        });
      }
    });

    out.delete();
    Path outPath = out.toPath();

    System.out.println("writing " + in + " into " + out);
    Files.write(outPath, pizzApazzAjs != null ? Files.readAllBytes(pizzApazzAjs.toPath()) : new byte[0], StandardOpenOption.CREATE);
    nodes.stream().filter(node -> node.parentName == null).forEach(node -> BuildJS.write(outPath, node));
  }

  @SuppressWarnings({"CallToPrintStackTrace", "BroadCatchBlock", "TooBroadCatch", "UseSpecificCatch"})
  private static void write(Path outPath, TreeNode node) {
    try {
      Files.write(outPath, node.content.getBytes(), StandardOpenOption.APPEND);
      node.children.forEach(child -> BuildJS.write(outPath, child));
    } catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  private static String rename(String content) {
    for (String name : BuildJS.toRename) {
      content = content.replace("J" + name, "JS" + name);
    }
    return content;
  }

  private static class TreeNode {

    String name;
    String parentName;
    String content;
    List<TreeNode> children = new ArrayList<>();

    @Override
    public String toString() {
      return "*" + name + "*->*" + parentName + "*";
    }
  }

  public static void main(String[] args) throws Exception {
    boolean findParent = "-find_parent".equals(args[4]);
    boolean rename = "-rename".equals(args[5]);

    switch (args[0]) {
      case "w":
        BuildJS.watch("NOFILE".equals(args[1]) ? null : new File(args[1]), new File(args[2]), new File(args[3]), findParent, rename);
        break;
      case "b":
        BuildJS.write("NOFILE".equals(args[1]) ? null : new File(args[1]), new File(args[2]), new File(args[3]), findParent, rename);
    }
  }
}
