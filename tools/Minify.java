
import java.io.DataOutputStream;
import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class Minify {

  public static void main(String[] args) throws Exception {
    String content = Files.readString(Path.of(args[1]));
    content = URLEncoder.encode(content, Charset.forName("utf-8"));
    byte[] data = ("input=" + content).getBytes(StandardCharsets.UTF_8);

    HttpURLConnection conn = (HttpURLConnection) new URL(args[0]).openConnection();
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
    conn.setRequestProperty("Content-Length", Integer.toString(data.length));
    conn.setRequestProperty("charset", "utf-8");
    conn.setInstanceFollowRedirects(false);
    conn.setRequestMethod("POST");
    conn.setDoInput(true);
    conn.setDoOutput(true);
    conn.setUseCaches(false);

    try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
      wr.write(data);
    }

    Files.copy(conn.getInputStream(), new File(args[2]).toPath(), StandardCopyOption.REPLACE_EXISTING);
  }
}
