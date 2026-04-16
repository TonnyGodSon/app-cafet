package com.cafeteria.repository;

import com.cafeteria.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findBySaleCode(String saleCode);
    List<Sale> findByStatus(String status);
}
