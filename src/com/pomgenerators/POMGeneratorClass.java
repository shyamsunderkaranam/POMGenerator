package com.pomgenerators;

public class POMGeneratorClass {

	public static void main(String[] args) {

		// TODO Auto-generated method stub
		String newline = "\n";
		String jarFileName="test.jar";
		String versionTag = "version.";
		String actualVersion = "1.0.0";
		String versionEndTag = "</version.";
		String jarPath = "${project.basedir}/lib/";
		String jarFilePath = "lib\\test.jar";
		String versionTagName = "${"+versionTag.concat(jarFileName)+"}";
		versionTag = "<"+versionTag.concat(jarFileName+">") ;
		versionEndTag = versionEndTag.concat(jarFileName+">");
		String versionFullTag = versionTag.concat(actualVersion);
		versionFullTag = versionFullTag.concat(versionEndTag);
		System.out.println(versionFullTag);
		
		String dependencyStartTag = "<dependency>";
		String dependencyEndTag = "</dependency>";
		String actualVersionStartTag = "<version>";
		String actualVersionEndTag = "</version>";
		String groupIdStartTag = "<groupId>";
		String groupIdEndTag = "</groupId>";
		String artifactIdStartTag = "<artifactId>";
		String artifactIdEndTag = "</artifactId>";
		String groupId = groupIdStartTag.concat(jarFileName).concat(groupIdEndTag);
		String artifactId = artifactIdStartTag.concat(jarFileName).concat(artifactIdEndTag);
		String dependencyVersion = actualVersionStartTag.concat(versionTagName).concat(actualVersionEndTag);
		String finalDependecyTag = dependencyStartTag+newline
				+groupId+newline
				+artifactId+newline
				+dependencyVersion+newline
				+dependencyEndTag+newline
				;
		System.out.println(finalDependecyTag);

		String phaseFullTag =  "<phase>clean</phase>";
		String repoLayoutTag = "<repositoryLayout>default</repositoryLayout>" ;
		String packagingTag = "<packaging>war</packaging>";
		String generatePomTag = "<generatePom>true</generatePom>";
		String goalsTag = "<goals><goal>install-file</goal></goals>";
		String executionStartTag = "<execution>";
		String executionEndTag = "</execution>";
		String executionsStartTag = "<executions>";
		String executionsEndTag = "</executions>";
		String configurationStartTag = "<configuration>";
		String configurationEndTag = "</configuration>";
		String fileTag = "<file>"+jarPath+jarFileName+"</file>";
		String idTag = "<id>"+jarFileName+"</id>";
		String executionFullTag = executionStartTag+newline
				+idTag+newline
				+phaseFullTag+newline
				+configurationStartTag+newline
				+repoLayoutTag+newline
				+groupId+newline
				+artifactId+newline
				+dependencyVersion+newline
				+fileTag+newline
				+packagingTag+newline
				+generatePomTag+newline
				+configurationEndTag+newline
				+goalsTag+newline
				+executionEndTag
				;
		String executionsFullTag=executionsStartTag+newline+executionFullTag+newline+executionsEndTag;
		System.out.println(executionsFullTag);
		
		String installCmd = "mvn install:install-file -Dfile="+jarFilePath
				+" -DgroupId="+jarFileName
				+" -DartifactId="+jarFileName
				+" -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true"
				;
		System.out.println(installCmd);
				
		
		

	}

}
