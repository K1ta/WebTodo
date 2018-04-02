package todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TodoRepository extends JpaRepository<Element, Long> {

    @Query(value = "SELECT * from todoData ORDER BY id", nativeQuery = true)
    List<Element> getAllElements();

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO todoData(id, data, ready) VALUES(:id, :data, :ready)", nativeQuery = true)
    void insertElement(
            @Param("id") Long id,
            @Param("data") String data,
            @Param("ready") Boolean ready
    );

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM todoData WHERE id=:id", nativeQuery = true)
    void deleteById(
            @Param("id") Long id
    );

    @Transactional
    @Modifying
    @Query(value = "UPDATE todoData SET data=:data, ready=:ready where id=:id", nativeQuery = true)
    void update(
            @Param("id") Long id,
            @Param("data") String data,
            @Param("ready") Boolean ready
    );

}
