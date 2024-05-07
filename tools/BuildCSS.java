
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
import java.util.HashMap;
import java.util.Map;

public class BuildCSS {

  @SuppressWarnings({"UseOfSystemOutOrSystemErr", "CallToPrintStackTrace", "MismatchedQueryAndUpdateOfCollection"})
  private static void watch(File in, File out) throws Exception {
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
          BuildCSS.write(in, out);
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      });

      watchKey.reset();
    }
  }

  @SuppressWarnings({"UseOfSystemOutOrSystemErr", "CallToPrintStackTrace", "UseSpecificCatch", "BroadCatchBlock", "TooBroadCatch"})
  private static void write(File in, File out) throws Exception {
    out.delete();
    Path outPath = out.toPath();

    System.out.println("writing " + in + " into " + out);
    Files.find(in.toPath(), 999, (p, bfa) -> bfa.isRegularFile() && p.getFileName().toString().matches(".*\\.css")).forEach(path -> {
      try {
        Files.write(outPath, Files.readAllBytes(path), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
      } catch (Exception ex) {
        ex.printStackTrace();
      }
    });
  }

  public static void main(String[] args) throws Exception {
    switch (args[0]) {
      case "w":
        BuildCSS.watch(new File(args[1]), new File(args[2]));
        break;
      case "b":
        BuildCSS.write(new File(args[1]), new File(args[2]));
    }
  }
}
