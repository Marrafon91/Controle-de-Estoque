package https.github.com.fernandesdennys.dispensa.utils;

public final class PaginacaoUtil {

    private static final int SIZE_MIN = 1;
    private static final int SIZE_MAX = 100;

    private PaginacaoUtil() {}

    public static int clampSize(Integer size) {
        if (size == null) return 20;
        return Math.clamp(size, SIZE_MIN, SIZE_MAX);
    }

    public static int clampPage(Integer page) {
        if (page == null || page < 0) return 0;
        return page;
    }
}