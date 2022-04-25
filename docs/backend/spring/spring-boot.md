# Spring Boot启动流程
开发一个 Spring Boot 项目，都会用到如下启动类
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

从中可以看出，关键部分有两个，一个是第 1 行的注解 `@SpringBootApplication`，一个是第 5 行的 `SpringApplication.run(...)`。
所以要了解 Spring Boot 的启动流程，从这两位入手就可以了。

## @SpringBootApplication
`@SpringBootApplication` 是 SpringBoot 应用的核心注解，它其实是一个组合注解：
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    ...
}
```
虽然使用了多个 Annotation 进行原信息标注，但是其中重要的只有三个：
* `@Configuration`（点开`@SpringBootConfiguration`会发现里面还是用了`@Configuration`）
* `@EnableAutoConfiguration`
* `@ComponentScan`

下面分别介绍这三个注解。

### @Configuration
这里的 `@Configuration` 对我们来说应该不陌生，他就是 JavaConfig 形式的 Spring IoC 容器的配置类使用的那个 `@Configuration`。

所以，这里的启动类标注了 `@Configuration` 后，本身其实也是一个 IoC 容器的配置类。

### @ComponentScan
这个注解在 Spring 中非常重要，它对应 XML 配置中的元素。`@ComponentScan` 的功能其实就是自动扫描并加载符合条件的组件（比如 `@Component` 和 `@Repository` 等）或者 Bean 定义，最终将这些 Bean 定义加载到 IoC 容器中。

我们可以通过 basPackages 等属性来细粒度定制 @ComponentScan 自动扫描的范围。如果不指定，则 Spring 会默认从声明 @ComponentScan 所在类的 package 进行扫描。

> 所以 Spring Boot 的启动类最好是放在 root package 下，防止自动扫描范围不对。

### @EnableAutoConfiguration
这个注解同样非常重要，它主要是借助 @Import 的支持，将所有符合自动配置条件的 bean 定义加载到 IoC 容器中。

`@EnableAutoConfiguration` 作为一个复合注解，其自身定义关键信息如下：
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    ...
}
```
其中最关键的就是 `@Import(AutoConfigurationImportSelector.class)`，借助 `@AutoConfigurationImportSelector`，可以帮助 Spring Boot 应用将所有符合条件的 `@Configuration` 配置都加载到当前 IoC 容器中。
就像一只“八爪鱼”一样，借助 Spring 框架原有的一个工具类：SpringFactoriesLoader 的支持，`@EnableAutoConfiguration` 可以智能的自动配置功效才大功告成。

![EnableAutoConfiguration](./enableautoconfiguration.png)

上面提到的 SpringFactoriesLoader 在 Spring 中用到的地方非常多，其主要功能就是从指定的配置文件 `META-INF/spring.factories` 中加载配置。
```java
public abstract class SpringFactoriesLoader {
    //...
    public static <T> List<T> loadFactories(Class<T> factoryClass, ClassLoader classLoader) {
        ...
    }


    public static List<String> loadFactoryNames(Class<?> factoryClass, ClassLoader classLoader) {
        ....
    }
}
```
配合 `@EnableAutoConfiguration` 使用时，它提供了一种配置查找的功能支持，即根据 `@EnableAutoConfiguration` 的完整类名 `org.springframework.boot.autoconfigure.EnableAutoConfiguration` 作为查找的 key，获取对应的一组 `@Configuration` 类。

![SpringFactoriesLoader](./spring-factories-loader.jpeg)

上图是从 Spring Boot 的 autoconfigure 依赖包中的 `META-INF/spring.factories` 中摘录的一段内容，可以很好的说明问题。

所以，`@EnableAutoConfiguration` 自动配置的魔法其实是：
* 从 classpath 中搜寻所有的 `META-INF/spring.factories` 配置文件，并将其中 `org.springframework.boot.autoconfigure.EnableutoConfiguration` 对应的配置项通过反射（Java Refletion）实例化为对应的标注了 `@Configuration` 的 JavaConfig 形式的 IoC 容器配置类，然后汇总为一个并加载到 IoC 容器.