import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.List;

public class SshClientUI extends Application {

    private List<Server> servers;
    private ComboBox<String> tierBox = new ComboBox<>();
    private ComboBox<String> personaBox = new ComboBox<>();
    private ComboBox<String> hostBox = new ComboBox<>();
    private TextField usernameField = new TextField();
    private PasswordField passwordField = new PasswordField();

    private TextField filePathField = new TextField("servers.json"); // default value

    @Override
    public void start(Stage primaryStage) {
        // Username input
        usernameField.setPromptText("Enter username");
        passwordField.setPromptText("Enter password (optional)");

        // File chooser controls
        Button browseBtn = new Button("Browse...");
        Button reloadBtn = new Button("Reload");

        browseBtn.setOnAction(e -> {
            FileChooser chooser = new FileChooser();
            chooser.setTitle("Select Servers JSON File");
            chooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("JSON Files", "*.json"));
            File file = chooser.showOpenDialog(primaryStage);
            if (file != null) {
                filePathField.setText(file.getAbsolutePath());
                loadAndPopulate(file.getAbsolutePath());
            }
        });

        reloadBtn.setOnAction(e -> loadAndPopulate(filePathField.getText()));

        HBox fileRow = new HBox(5, new Label("Config:"), filePathField, browseBtn, reloadBtn);

        // Disable persona/host initially
        personaBox.setDisable(true);
        hostBox.setDisable(true);

        // Populate based on selections
        tierBox.setOnAction(e -> updatePersonaOptions());
        personaBox.setOnAction(e -> updateHostOptions());

        Button openBtn = new Button("Open SSH");
        openBtn.setOnAction(e -> openSsh());

        VBox layout = new VBox(10,
                fileRow,
                usernameField,
                passwordField,
                tierBox,
                personaBox,
                hostBox,
                openBtn
        );
        layout.setStyle("-fx-padding: 20; -fx-font-size: 14px;");

        primaryStage.setScene(new Scene(layout, 500, 350));
        primaryStage.setTitle("SSH Launcher");
        primaryStage.show();

        // Load default config on startup
        loadAndPopulate(filePathField.getText());
    }

    private void loadAndPopulate(String filePath) {
        try {
            servers = loadServers(filePath);

            // Reset dropdowns
            tierBox.getItems().clear();
            personaBox.getItems().clear();
            hostBox.getItems().clear();
            personaBox.setDisable(true);
            hostBox.setDisable(true);

            servers.stream().map(Server::getTier).distinct().forEach(tierBox.getItems()::add);

        } catch (Exception ex) {
            showAlert("Error", "Failed to load servers from " + filePath + "\n" + ex.getMessage());
        }
    }

    private void updatePersonaOptions() {
        String selectedTier = tierBox.getValue();
        personaBox.getItems().clear();
        if (selectedTier != null) {
            servers.stream()
                    .filter(s -> s.getTier().equals(selectedTier))
                    .map(Server::getPersona).distinct()
                    .forEach(personaBox.getItems()::add);
            personaBox.setDisable(false);
            hostBox.getItems().clear();
            hostBox.setDisable(true);
        }
    }

    private void updateHostOptions() {
        String selectedTier = tierBox.getValue();
        String selectedPersona = personaBox.getValue();
        hostBox.getItems().clear();
        if (selectedTier != null && selectedPersona != null) {
            servers.stream()
                    .filter(s -> s.getTier().equals(selectedTier) && s.getPersona().equals(selectedPersona))
                    .map(Server::getHost)
                    .forEach(hostBox.getItems()::add);
            hostBox.setDisable(false);
        }
    }

    private void openSsh() {
        String username = usernameField.getText();
        String host = hostBox.getValue();

        if (username == null || username.isBlank() || host == null) {
            showAlert("Missing input", "Please enter username and select Tier, Persona, and Host.");
            return;
        }

        try {
            String command = String.format("cmd.exe /c start ssh %s@%s", username, host);
            Runtime.getRuntime().exec(command);
        } catch (Exception ex) {
            ex.printStackTrace();
            showAlert("Error", "Failed to open SSH session: " + ex.getMessage());
        }
    }

    private List<Server> loadServers(String filePath) throws Exception {
        Gson gson = new Gson();
        Type listType = new TypeToken<List<Server>>() {}.getType();
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, listType);
        }
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

class Server {
    private String tier;
    private String persona;
    private String host;

    public String getTier() { return tier; }
    public String getPersona() { return persona; }
    public String getHost() { return host; }
}