package todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class ApiController {
    @Autowired
    private TodoRepository repository;

    @GetMapping("/all")
    public @ResponseBody
    List<Element> getAllElements() {
        List<Element> list = repository.getAllElements();
        return list;
    }

    @PostMapping("/add")
    public @ResponseBody
    void addElementToDataBase(@RequestBody Element element) {
        repository.insertElement(element.getId(), element.getData(), element.getReady());
    }

    @PostMapping("/remove")
    public @ResponseBody
    void deleteElementFromDataBaseById(@RequestBody Long id) {
        repository.deleteById(id);
    }

    @PostMapping("/update")
    public @ResponseBody
    void updateElement(@RequestBody Element element) {
        repository.update(element.getId(), element.getData(), element.getReady());
    }

}