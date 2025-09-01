package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.IoTData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IoTDataRepository extends JpaRepository<IoTData, Long> {
    List<IoTData> findBySpaceId(Long spaceId);
    List<IoTData> findBySpaceIdAndSensorType(Long spaceId, IoTData.SensorType sensorType);

    @Query("SELECT i FROM IoTData i WHERE i.space.id = :spaceId AND " +
            "i.timestamp BETWEEN :start AND :end ORDER BY i.timestamp DESC")
    List<IoTData> findBySpaceIdAndTimeRange(@Param("spaceId") Long spaceId,
                                            @Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);

    @Query("SELECT i FROM IoTData i WHERE i.space.id = :spaceId AND " +
            "i.sensorType = :sensorType AND i.timestamp BETWEEN :start AND :end ORDER BY i.timestamp DESC")
    List<IoTData> findBySpaceIdAndSensorTypeAndTimeRange(@Param("spaceId") Long spaceId,
                                                         @Param("sensorType") IoTData.SensorType sensorType,
                                                         @Param("start") LocalDateTime start,
                                                         @Param("end") LocalDateTime end);

    @Query("SELECT i FROM IoTData i WHERE i.space.id = :spaceId ORDER BY i.timestamp DESC LIMIT :limit")
    List<IoTData> findLatestBySpaceId(@Param("spaceId") Long spaceId, @Param("limit") int limit);

    List<IoTData> findLatestBySpaceIdAndSensorType(Long spaceId, IoTData.SensorType sensorType, int i);
}
