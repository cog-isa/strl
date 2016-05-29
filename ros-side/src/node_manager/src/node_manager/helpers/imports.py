import os, imp, inspect


def import_file(filename):
    (path, name) = os.path.split(filename)
    (name, ext) = os.path.splitext(name)
    (file, filename, data) = imp.find_module(name, [path])
    return imp.load_module(name, file, filename, data)


def import_classes(filename, classes=None):
    module = import_file(filename)
    klasses = [name for name, obj
            in inspect.getmembers(module, inspect.isclass)
            if obj.__module__ == module.__name__ and
               (not classes or name in classes)]
    return [getattr(module, klassname)
        for klassname in klasses]


def import_classes_from_modules(modules, dirname):
    filenames = [os.path.join(dirname, module) for module in modules]
    klasses = [import_classes(filename) for filename in filenames]
    return zip(*klasses)[0]
