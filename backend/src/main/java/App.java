
// import java.sql.SQLException;
// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.sql.ResultSet;
// import java.sql.Statement;
import java.util.List;

import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.repository.MenuRepository;
import com.new_cafe.app.backend.repository.NewMenuRepository;

public class App {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello World");

        MenuRepository menuRepository = new NewMenuRepository();
        List<Menu> menus = menuRepository.findAll();

        System.out.println(menus);
    }
}
