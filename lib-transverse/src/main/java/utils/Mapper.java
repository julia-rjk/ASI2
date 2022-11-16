package utils;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class Mapper {
    /**
     * Static method to map an object into another
     *
     * @param source      the source object
     * @param targetClass the target object
     * @param <S>         the type of the source
     * @param <T>         the type of the target
     * @return the object mapped into the targeted type
     * @author Atma
     */
    public static <S, T> T map(S source, Class<T> targetClass) {
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(source, targetClass);
    }

    /**
     * Static method to map a list of objects into another
     *
     * @param source      The list of the source object
     * @param targetClass The type of the list of target object
     * @param <S>         The Type of the source
     * @param <T>         The Type of the target class
     * @return A list of the targeted type
     * @author Atma
     */
    public static <S, T> List<T> mapList(List<S> source, Class<T> targetClass) {
        ModelMapper modelMapper = new ModelMapper();
        return source
                .stream()
                .map(element -> modelMapper.map(element, targetClass))
                .collect(Collectors.toList());
    }
}
